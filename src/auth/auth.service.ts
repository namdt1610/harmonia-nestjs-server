import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from '../schemas/user.schema';

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface GoogleUserDto {
  email: string;
  firstName: string;
  lastName: string;
  googleId: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, username, password, firstName, lastName } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      }
      if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new this.userModel({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const savedUser = await user.save();

    // Generate JWT token
    const accessToken = this.generateJwtToken(savedUser);

    // Convert to object and remove password
    const userObject = savedUser.toObject();
    delete userObject.password;

    return { user: userObject, accessToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userModel.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    // Generate JWT token
    const accessToken = this.generateJwtToken(user);

    // Convert to object and remove password
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, accessToken };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();

    if (user && user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel
      .findById(id)
      .populate('subscription')
      .populate({
        path: 'subscription',
        populate: {
          path: 'plan',
        },
      })
      .exec();
  }

  private generateJwtToken(user: User): string {
    const payload = {
      sub: user._id || user.id,
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload);
  }

  async googleLogin(
    googleUser: GoogleUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, firstName, lastName, googleId } = googleUser;

    // Check if user exists with this Google ID
    let user = await this.userModel.findOne({ googleSub: googleId });

    if (!user) {
      // Check if user exists with this email
      user = await this.userModel.findOne({ email });

      if (user) {
        // Link Google account to existing user
        user.googleSub = googleId;
        await user.save();
      } else {
        // Create new user
        const username =
          email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 9);
        user = new this.userModel({
          email,
          username,
          firstName,
          lastName,
          googleSub: googleId,
        });
        await user.save();
      }
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const accessToken = this.generateJwtToken(user);

    // Convert to object and remove password
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, accessToken };
  }

  async refreshToken(user: User): Promise<{ accessToken: string }> {
    const accessToken = this.generateJwtToken(user);
    return { accessToken };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel
      .findById(userId)
      .select('+password')
      .exec();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userModel.findByIdAndUpdate(userId, {
      password: hashedNewPassword,
    });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      // Don't reveal whether user exists or not
      return;
    }

    // Generate reset token (in production, send this via email)
    const resetToken = this.jwtService.sign(
      { sub: user._id, type: 'password-reset' },
      { expiresIn: '1h' },
    );

    // Store reset token (you might want to store this in a separate collection)
    // For now, we'll just log it (in production, send via email)
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token);

      if (payload.type !== 'password-reset') {
        throw new BadRequestException('Invalid token type');
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await this.userModel.findByIdAndUpdate(payload.sub, {
        password: hashedPassword,
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
