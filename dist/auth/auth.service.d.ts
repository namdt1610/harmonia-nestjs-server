import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
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
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(createUserDto: CreateUserDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: User;
        accessToken: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    private generateJwtToken;
}
