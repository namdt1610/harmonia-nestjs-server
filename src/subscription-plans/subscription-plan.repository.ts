import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SubscriptionPlan, Prisma } from '@prisma/client';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

// Define enums since they're used in the original file
export enum PlanType {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM',
  FAMILY = 'FAMILY',
  STUDENT = 'STUDENT',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME',
}

@Injectable()
export class SubscriptionPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSubscriptionPlanDto: CreateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.create({
      data: createSubscriptionPlanDto,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters: {
      planType?: PlanType;
      billingCycle?: BillingCycle;
      isActive?: boolean;
      minPrice?: number;
      maxPrice?: number;
    } = {},
  ): Promise<{
    plans: SubscriptionPlan[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const where: Prisma.SubscriptionPlanWhereInput = {};

    if (filters.planType) {
      where.planType = filters.planType;
    }

    if (filters.billingCycle) {
      where.billingCycle = filters.billingCycle;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    const skip = (page - 1) * limit;

    const [plans, total] = await Promise.all([
      this.prisma.subscriptionPlan.findMany({
        where,
        skip,
        take: limit,
        include: {
          subscriptions: true,
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      this.prisma.subscriptionPlan.count({ where }),
    ]);

    return {
      plans,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        subscriptions: true,
      },
    });
  }

  async findByPlanType(planType: PlanType): Promise<SubscriptionPlan[]> {
    return this.prisma.subscriptionPlan.findMany({
      where: {
        planType,
        isActive: true,
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActivePlans(): Promise<SubscriptionPlan[]> {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByBillingCycle(
    billingCycle: BillingCycle,
  ): Promise<SubscriptionPlan[]> {
    return this.prisma.subscriptionPlan.findMany({
      where: {
        billingCycle,
        isActive: true,
      },
      orderBy: { price: 'asc' },
    });
  }

  async findMostPopular(limit = 5): Promise<any[]> {
    // Get subscription plans with their subscription counts
    const plans = await this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      include: {
        subscriptions: true,
      },
    });

    // Calculate subscription count and sort
    const plansWithCounts = plans.map((plan) => ({
      ...plan,
      subscriptionCount: plan.subscriptions.length,
    }));

    return plansWithCounts
      .sort((a, b) => {
        if (b.subscriptionCount === a.subscriptionCount) {
          return a.sortOrder - b.sortOrder;
        }
        return b.subscriptionCount - a.subscriptionCount;
      })
      .slice(0, limit);
  }

  async update(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ): Promise<SubscriptionPlan | null> {
    try {
      return await this.prisma.subscriptionPlan.update({
        where: { id },
        data: updateSubscriptionPlanDto,
        include: {
          subscriptions: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.subscriptionPlan.delete({ where: { id } });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        return false;
      }
      throw error;
    }
  }

  async getStatistics(): Promise<{
    totalPlans: number;
    activePlans: number;
    inactivePlans: number;
    plansByType: Record<PlanType, number>;
    plansByBillingCycle: Record<BillingCycle, number>;
    totalSubscriptions: number;
    averagePrice: number;
  }> {
    const [
      totalPlans,
      activePlans,
      plansByType,
      plansByBillingCycle,
      subscriptionStats,
      avgPrice,
    ] = await Promise.all([
      this.prisma.subscriptionPlan.count(),
      this.prisma.subscriptionPlan.count({ where: { isActive: true } }),
      this.prisma.subscriptionPlan.groupBy({
        by: ['planType'],
        _count: { id: true },
      }),
      this.prisma.subscriptionPlan.groupBy({
        by: ['billingCycle'],
        _count: { id: true },
      }),
      this.prisma.userSubscription.count(),
      this.prisma.subscriptionPlan.aggregate({
        _avg: { price: true },
      }),
    ]);

    const planTypeStats = plansByType.reduce(
      (acc, item) => {
        acc[item.planType as PlanType] = item._count.id;
        return acc;
      },
      {} as Record<PlanType, number>,
    );

    const billingCycleStats = plansByBillingCycle.reduce(
      (acc, item) => {
        acc[item.billingCycle as BillingCycle] = item._count.id;
        return acc;
      },
      {} as Record<BillingCycle, number>,
    );

    return {
      totalPlans,
      activePlans,
      inactivePlans: totalPlans - activePlans,
      plansByType: planTypeStats,
      plansByBillingCycle: billingCycleStats,
      totalSubscriptions: subscriptionStats,
      averagePrice: avgPrice._avg.price || 0,
    };
  }

  async deactivatePlan(id: string): Promise<SubscriptionPlan | null> {
    try {
      return await this.prisma.subscriptionPlan.update({
        where: { id },
        data: { isActive: false },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async activatePlan(id: string): Promise<SubscriptionPlan | null> {
    try {
      return await this.prisma.subscriptionPlan.update({
        where: { id },
        data: { isActive: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async updateSortOrder(
    planUpdates: { id: string; sortOrder: number }[],
  ): Promise<boolean> {
    try {
      await this.prisma.$transaction(
        planUpdates.map(({ id, sortOrder }) =>
          this.prisma.subscriptionPlan.update({
            where: { id },
            data: { sortOrder },
          }),
        ),
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}
