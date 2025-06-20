import { AuthService, CreateUserDto, LoginDto } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        user: import("../entities/user.entity").User;
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import("../entities/user.entity").User;
        accessToken: string;
    }>;
    getProfile(req: any): Promise<any>;
    refreshToken(req: any): Promise<any>;
}
