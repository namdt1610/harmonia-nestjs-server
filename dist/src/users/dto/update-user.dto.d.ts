import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    email?: string;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    image?: string;
    isActive?: boolean;
    isStaff?: boolean;
    isSuperuser?: boolean;
    googleSub?: string;
}
export {};
