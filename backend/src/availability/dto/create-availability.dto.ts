import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Tutor ID. Optional for tutors (auto-derived from authenticated user).',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tutorId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  @ApiProperty({
    description: 'Day of week (0=Sunday, 6=Saturday). Required when isRecurring=true.',
    required: false,
    minimum: 0,
    maximum: 6,
    example: 1,
  })
  dayOfWeek?: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'Start time in HH:mm format.',
    example: '09:00',
  })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  @ApiProperty({
    description: 'End time in HH:mm format.',
    example: '11:00',
  })
  endTime: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether this is a recurring weekly slot. Defaults to true.',
    required: false,
    default: true,
  })
  isRecurring?: boolean;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Specific date for non-recurring slots (YYYY-MM-DD). Required when isRecurring=false.',
    required: false,
    example: '2026-03-15',
  })
  specificDate?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date from which recurring slot is effective (YYYY-MM-DD).',
    required: false,
    example: '2026-01-01',
  })
  effectiveFrom?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'Date until which recurring slot is effective (YYYY-MM-DD).',
    required: false,
    example: '2026-12-31',
  })
  effectiveUntil?: string;
}
