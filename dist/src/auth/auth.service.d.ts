import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
export interface GoogleUserDto {
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(createUserDto: CreateUserDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    findUserById(id: string): Promise<User | null>;
    googleLogin(googleUser: GoogleUserDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    refreshToken(userId: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            image: string | null;
            isStaff: boolean;
            isSuperuser: boolean;
        };
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    forgotPassword(email: string): Promise<void>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
