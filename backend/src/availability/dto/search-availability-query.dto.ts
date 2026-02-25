import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchAvailabilityQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by tutor ID (admin/super_admin only).',
    required: false,
  })
  tutorId?: string;

  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsInt()
  @Min(0)
  @Max(6)
  @ApiProperty({
    description: 'Filter by day of week (0=Sunday, 6=Saturday).',
    required: false,
    minimum: 0,
    maximum: 6,
  })
  dayOfWeek?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Inclusive start date filter (YYYY-MM-DD).',
    required: false,
  })
  startDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Inclusive end date filter (YYYY-MM-DD).',
    required: false,
  })
  endDate?: string;
}
