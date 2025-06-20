export declare class UserResponseDto {
    id: string;
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    isActive: boolean;
    isStaff: boolean;
    isSuperuser: boolean;
    dateJoined: Date;
    lastLogin?: Date;
    bio?: string;
    image?: string;
    fullName?: string;
    playlistCount?: number;
    favoriteTracksCount?: number;
    createdAt: Date;
    updatedAt: Date;
}
