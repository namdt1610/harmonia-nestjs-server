import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  PlanType,
  BillingCycle,
  AudioQuality,
} from '../../schemas/subscription-plan.schema';

export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: 'Premium Monthly' })
  @IsString()
  name: string;

  @ApiProperty({ enum: PlanType, example: PlanType.PREMIUM })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiProperty({ enum: BillingCycle, example: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiProperty({ example: 9.99 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 100, description: '0 means unlimited' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxOfflineTracks?: number;

  @ApiPropertyOptional({ enum: AudioQuality, example: AudioQuality.HIGH })
  @IsOptional()
  @IsEnum(AudioQuality)
  audioQuality?: AudioQuality;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  adsFree?: boolean;

  @ApiPropertyOptional({
    example: 6,
    description: 'per hour, 0 means unlimited',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  skipLimit?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canDownload?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canCreatePlaylists?: boolean;

  @ApiPropertyOptional({ example: 50, description: '0 means unlimited' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPlaylists?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  familyAccounts?: number;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  canUploadMusic?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  analyticsAccess?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  prioritySupport?: boolean;

  @ApiPropertyOptional({
    example: 'Premium plan with high-quality audio and no ads',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: ['High-quality audio', 'No ads', 'Unlimited skips'],
    description: 'List of features',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  featuresList?: string[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number;
}
