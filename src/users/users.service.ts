import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['subscription', 'subscription.plan'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
    });
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findById(id);

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deactivateAccount(id: string): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }

  async reactivateAccount(id: string): Promise<void> {
    await this.userRepository.update(id, { isActive: true });
  }
}
