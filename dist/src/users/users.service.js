"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: createUserDto.email },
                    { username: createUserDto.username },
                ],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email or username already exists');
        }
        let hashedPassword;
        if (createUserDto.password) {
            hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        }
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
    }
    async findAll(page = 1, limit = 10, filters = {}) {
        const where = {};
        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }
        if (filters.isStaff !== undefined) {
            where.isStaff = filters.isStaff;
        }
        if (filters.search) {
            where.OR = [
                { username: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { firstName: { contains: filters.search, mode: 'insensitive' } },
                { lastName: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    firstName: true,
                    lastName: true,
                    isActive: true,
                    isStaff: true,
                    isSuperuser: true,
                    dateJoined: true,
                    lastLogin: true,
                    bio: true,
                    image: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                subscription: {
                    include: { plan: true },
                },
                playlists: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async findByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
    async findByGoogleSub(googleSub) {
        return this.prisma.user.findFirst({
            where: { googleSub },
        });
    }
    async update(id, updateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateUserDto.email || updateUserDto.username) {
            const conflictUser = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        {
                            OR: [
                                updateUserDto.email ? { email: updateUserDto.email } : {},
                                updateUserDto.username
                                    ? { username: updateUserDto.username }
                                    : {},
                            ].filter((obj) => Object.keys(obj).length > 0),
                        },
                    ],
                },
            });
            if (conflictUser) {
                throw new common_1.ConflictException('Email or username already exists');
            }
        }
        let updateData = { ...updateUserDto };
        if (updateUserDto.password) {
            updateData.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
        });
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.delete({
            where: { id },
        });
    }
    async updateLastLogin(id) {
        try {
            return await this.prisma.user.update({
                where: { id },
                data: { lastLogin: new Date() },
            });
        }
        catch (error) {
            return null;
        }
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user &&
            user.password &&
            (await bcrypt.compare(password, user.password))) {
            const { password: _, ...result } = user;
            return result;
        }
        return null;
    }
    async createGoogleUser(googleProfile) {
        return this.prisma.user.create({
            data: {
                email: googleProfile.emails[0].value,
                username: googleProfile.emails[0].value.split('@')[0],
                firstName: googleProfile.name.givenName,
                lastName: googleProfile.name.familyName,
                image: googleProfile.photos[0]?.value,
                googleSub: googleProfile.id,
                isActive: true,
            },
        });
    }
    async getUserStats(userId) {
        const [totalPlaylists, totalFavoriteTracks, totalFavoriteArtists, totalFavoriteAlbums, totalActivities,] = await Promise.all([
            this.prisma.playlist.count({ where: { userId } }),
            this.prisma.userFavoriteTrack.count({ where: { userId } }),
            this.prisma.userFavoriteArtist.count({ where: { userId } }),
            this.prisma.userFavoriteAlbum.count({ where: { userId } }),
            this.prisma.userActivity.count({ where: { userId } }),
        ]);
        return {
            totalPlaylists,
            totalFavoriteTracks,
            totalFavoriteArtists,
            totalFavoriteAlbums,
            totalActivities,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map