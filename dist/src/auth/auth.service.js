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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const prisma_service_1 = require("../common/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(createUserDto) {
        const { email, username, password, firstName, lastName } = createUserDto;
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ email: email }, { username: username }],
            },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException('User with this email or username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                isStaff: user.isStaff,
                isSuperuser: user.isSuperuser,
            },
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                isStaff: user.isStaff,
                isSuperuser: user.isSuperuser,
            },
        };
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
    async findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
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
                googleSub: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async googleLogin(googleUser) {
        let user = await this.prisma.user.findFirst({
            where: { googleSub: googleUser.googleId },
        });
        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: googleUser.email },
            });
            if (user) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleSub: googleUser.googleId },
                });
            }
            else {
                user = await this.prisma.user.create({
                    data: {
                        email: googleUser.email,
                        username: googleUser.email.split('@')[0],
                        firstName: googleUser.firstName,
                        lastName: googleUser.lastName,
                        image: googleUser.picture,
                        googleSub: googleUser.googleId,
                        isActive: true,
                    },
                });
            }
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                isStaff: user.isStaff,
                isSuperuser: user.isSuperuser,
            },
        };
    }
    async refreshToken(userId) {
        const user = await this.findUserById(userId);
        if (!user || !user.isActive) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                isStaff: user.isStaff,
                isSuperuser: user.isSuperuser,
            },
        };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return { message: 'Password changed successfully' };
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return;
        }
        const resetToken = this.jwtService.sign({ sub: user.id, type: 'password-reset' }, { expiresIn: '1h' });
        console.log(`Password reset token for ${email}: ${resetToken}`);
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'password-reset') {
                throw new common_1.BadRequestException('Invalid token type');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.prisma.user.update({
                where: { id: payload.sub },
                data: { password: hashedPassword },
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid or expired token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map