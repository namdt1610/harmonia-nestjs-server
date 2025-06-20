import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  PlanType,
  BillingCycle,
  AudioQuality,
} from '../../schemas/subscription-plan.schema';

export class SubscriptionPlanResponseDto {
  @ApiProperty()
  @Transform(({ value }) => value.toString())
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: PlanType })
  planType: PlanType;

  @ApiProperty({ enum: BillingCycle })
  billingCycle: BillingCycle;

  @ApiProperty()
  price: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  maxOfflineTracks: number;

  @ApiProperty({ enum: AudioQuality })
  audioQuality: AudioQuality;

  @ApiProperty()
  adsFree: boolean;

  @ApiProperty()
  skipLimit: number;

  @ApiProperty()
  canDownload: boolean;

  @ApiProperty()
  canCreatePlaylists: boolean;

  @ApiProperty()
  maxPlaylists: number;

  @ApiProperty()
  familyAccounts: number;

  @ApiProperty()
  canUploadMusic: boolean;

  @ApiProperty()
  analyticsAccess: boolean;

  @ApiProperty()
  prioritySupport: boolean;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ type: [String] })
  featuresList: string[];

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional()
  monthlyPrice?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
