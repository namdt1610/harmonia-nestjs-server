import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../entities/user.entity';

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
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, username, password, firstName, lastName } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }, { username }],
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
    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
    });

    await this.userRepository.save(user);

    // Generate JWT token
    const accessToken = this.generateJwtToken(user);

    // Remove password from response
    delete user.password;

    return { user, accessToken };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'isActive',
      ],
    });

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
    await this.userRepository.update(user.id, { lastLogin: new Date() });

    // Generate JWT token
    const accessToken = this.generateJwtToken(user);

    // Remove password from response
    delete user.password;

    return { user, accessToken };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'isActive',
      ],
    });

    if (user && user.isActive) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        delete user.password;
        return user;
      }
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['subscription', 'subscription.plan'],
    });
  }

  private generateJwtToken(user: User): string {
    const payload = {
      sub: user.id,
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
    let user = await this.userRepository.findOne({
      where: { googleSub: googleId },
    });

    if (!user) {
      // Check if user exists with this email
      user = await this.userRepository.findOne({
        where: { email },
      });

      if (user) {
        // Link Google account to existing user
        user.googleSub = googleId;
        await this.userRepository.save(user);
      } else {
        // Create new user
        const username =
          email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 9);
        user = this.userRepository.create({
          email,
          username,
          firstName,
          lastName,
          googleSub: googleId,
          password: '', // No password for Google users
        });
        await this.userRepository.save(user);
      }
    }

    // Update last login
    await this.userRepository.update(user.id, { lastLogin: new Date() });

    // Generate JWT token
    const accessToken = this.generateJwtToken(user);

    return { user, accessToken };
  }

  async refreshToken(user: User): Promise<{ accessToken: string }> {
    const accessToken = this.generateJwtToken(user);
    return { accessToken };
  }
}
