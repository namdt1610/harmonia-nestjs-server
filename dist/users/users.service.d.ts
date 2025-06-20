import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    updateProfile(id: string, updateData: Partial<User>): Promise<User>;
    deactivateAccount(id: string): Promise<void>;
    reactivateAccount(id: string): Promise<void>;
}
