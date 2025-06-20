import { PrismaService } from './prisma.service';
export declare abstract class BaseRepository<T> {
    protected readonly prisma: PrismaService;
    protected readonly modelName: string;
    constructor(prisma: PrismaService, modelName: string);
    protected get model(): any;
    create(data: any): Promise<T>;
    findAll(options?: {
        where?: any;
        include?: any;
        orderBy?: any;
        skip?: number;
        take?: number;
    }): Promise<T[]>;
    findOne(where: any, include?: any): Promise<T | null>;
    findById(id: string, include?: any): Promise<T | null>;
    update(id: string, data: any): Promise<T | null>;
    delete(id: string): Promise<T | null>;
    exists(where: any): Promise<boolean>;
    count(where?: any): Promise<number>;
    upsert(where: any, create: any, update: any): Promise<T>;
}
