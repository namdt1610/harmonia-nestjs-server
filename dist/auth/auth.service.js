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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("../entities/user.entity");
let AuthService = class AuthService {
    userRepository;
    jwtService;
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register(createUserDto) {
        const { email, username, password, firstName, lastName } = createUserDto;
        const existingUser = await this.userRepository.findOne({
            where: [{ email }, { username }],
        });
        if (existingUser) {
            if (existingUser.email === email) {
                throw new common_1.ConflictException('Email already exists');
            }
            if (existingUser.username === username) {
                throw new common_1.ConflictException('Username already exists');
            }
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            firstName,
            lastName,
        });
        await this.userRepository.save(user);
        const accessToken = this.generateJwtToken(user);
        delete user.password;
        return { user, accessToken };
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({
            where: { email },
            select: [
                'id',
                'email',
                'username',
                'password',
                'firstName',
                'lastName',
                'isActive',
            ],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.userRepository.update(user.id, { lastLogin: new Date() });
        const accessToken = this.generateJwtToken(user);
        delete user.password;
        return { user, accessToken };
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: [
                'id',
                'email',
                'username',
                'password',
                'firstName',
                'lastName',
                'isActive',
            ],
        });
        if (user && user.isActive) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                delete user.password;
                return user;
            }
        }
        return null;
    }
    async findById(id) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['subscription', 'subscription.plan'],
        });
    }
    generateJwtToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            username: user.username,
        };
        return this.jwtService.sign(payload);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map