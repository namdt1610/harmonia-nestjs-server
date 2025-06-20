import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export abstract class BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  protected get model() {
    return this.prisma[this.modelName];
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async findAll(options?: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<T[]> {
    return this.model.findMany(options);
  }

  async findOne(where: any, include?: any): Promise<T | null> {
    return this.model.findFirst({ where, include });
  }

  async findById(id: string, include?: any): Promise<T | null> {
    return this.model.findUnique({ where: { id }, include });
  }

  async update(id: string, data: any): Promise<T | null> {
    try {
      return await this.model.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Record not found
      }
      throw error;
    }
  }

  async delete(id: string): Promise<T | null> {
    try {
      return await this.model.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        return null; // Record not found
      }
      throw error;
    }
  }

  async exists(where: any): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }

  async count(where?: any): Promise<number> {
    return this.model.count({ where });
  }

  async upsert(where: any, create: any, update: any): Promise<T> {
    return this.model.upsert({
      where,
      create,
      update,
    });
  }
}
