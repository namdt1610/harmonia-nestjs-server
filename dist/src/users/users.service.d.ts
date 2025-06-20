import { PrismaService } from '../common/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(page?: number, limit?: number, filters?: {
        search?: string;
        isActive?: boolean;
        isStaff?: boolean;
    }): Promise<{
        users: {
            id: string;
            image: string | null;
            createdAt: Date;
            updatedAt: Date;
            bio: string | null;
            email: string;
            username: string;
            firstName: string | null;
            lastName: string | null;
            isActive: boolean;
            isStaff: boolean;
            isSuperuser: boolean;
            dateJoined: Date;
            lastLogin: Date | null;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByGoogleSub(googleSub: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
    updateLastLogin(id: string): Promise<User | null>;
    validateUser(email: string, password: string): Promise<User | null>;
    createGoogleUser(googleProfile: any): Promise<User>;
    getUserStats(userId: string): Promise<any>;
}
