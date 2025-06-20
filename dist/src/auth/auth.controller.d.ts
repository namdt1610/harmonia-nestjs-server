import { AuthService, CreateUserDto, LoginDto } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<{
        user: import(".prisma/client").User;
        accessToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: import(".prisma/client").User;
        accessToken: string;
    }>;
    getProfile(req: any): Promise<any>;
    refreshToken(req: any): Promise<{
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
}
