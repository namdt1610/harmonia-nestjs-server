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
exports.BaseRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let BaseRepository = class BaseRepository {
    prisma;
    modelName;
    constructor(prisma, modelName) {
        this.prisma = prisma;
        this.modelName = modelName;
    }
    get model() {
        return this.prisma[this.modelName];
    }
    async create(data) {
        return this.model.create({ data });
    }
    async findAll(options) {
        return this.model.findMany(options);
    }
    async findOne(where, include) {
        return this.model.findFirst({ where, include });
    }
    async findById(id, include) {
        return this.model.findUnique({ where: { id }, include });
    }
    async update(id, data) {
        try {
            return await this.model.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async delete(id) {
        try {
            return await this.model.delete({ where: { id } });
        }
        catch (error) {
            if (error.code === 'P2025') {
                return null;
            }
            throw error;
        }
    }
    async exists(where) {
        const count = await this.model.count({ where });
        return count > 0;
    }
    async count(where) {
        return this.model.count({ where });
    }
    async upsert(where, create, update) {
        return this.model.upsert({
            where,
            create,
            update,
        });
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, String])
], BaseRepository);
//# sourceMappingURL=base.repository.js.map