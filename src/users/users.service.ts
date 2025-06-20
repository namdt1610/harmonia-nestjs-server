import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel
      .findById(id)
      .populate('subscription')
      .populate({
        path: 'subscription',
        populate: {
          path: 'plan',
        },
      })
      .exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = new this.userModel(userData);
    return user.save();
  }

  async updateProfile(id: string, updateData: Partial<User>): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deactivateAccount(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isActive: false }).exec();
  }

  async reactivateAccount(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { isActive: true }).exec();
  }

  async addFavoriteTrack(userId: string, trackId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $addToSet: { favoriteTracks: trackId } },
        { new: true },
      )
      .exec();
  }

  async removeFavoriteTrack(userId: string, trackId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { favoriteTracks: trackId } },
        { new: true },
      )
      .exec();
  }

  async addRecentlyPlayed(userId: string, trackId: string): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { recentlyPlayed: trackId }, // Remove if already exists
        },
        { new: true },
      )
      .then(() =>
        this.userModel
          .findByIdAndUpdate(
            userId,
            {
              $push: {
                recentlyPlayed: {
                  $each: [trackId],
                  $position: 0,
                  $slice: 50, // Keep only last 50 tracks
                },
              },
            },
            { new: true },
          )
          .exec(),
      );
  }
}
