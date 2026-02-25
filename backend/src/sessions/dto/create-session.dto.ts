import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const SESSION_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'] as const;

export class CreateSessionDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Tutor ID. Optional for tutors (auto-derived from authenticated user).',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tutorId?: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Site ID for this session.',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  siteId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsUUID('4', { each: true })
  @ApiProperty({
    description: 'Batch of students for this session.',
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174002'],
  })
  studentIds: string[];

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Curriculum cluster ID. Required if skillId is not provided.',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  clusterId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Curriculum skill ID. Required if clusterId is not provided.',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174004',
  })
  skillId?: string;

  @IsDateString()
  @ApiProperty({
    description: 'Session date in YYYY-MM-DD format.',
    example: '2026-02-25',
  })
  sessionDate: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  @ApiProperty({
    description: 'Scheduled start time (HH:mm or HH:mm:ss).',
    required: false,
    example: '15:00',
  })
  scheduledStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  @ApiProperty({
    description: 'Actual start time (HH:mm or HH:mm:ss).',
    required: false,
    example: '15:05',
  })
  actualStartTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
  @ApiProperty({
    description: 'Actual end time (HH:mm or HH:mm:ss).',
    required: false,
    example: '16:00',
  })
  actualEndTime?: string;

  @IsOptional()
  @IsIn(SESSION_STATUSES)
  @ApiProperty({
    description: 'Session status.',
    required: false,
    enum: SESSION_STATUSES,
    default: 'scheduled',
  })
  status?: (typeof SESSION_STATUSES)[number];

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Duration in minutes.',
    required: false,
    example: 60,
  })
  minutes?: number;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @ApiProperty({
    description: 'Optional notes.',
    required: false,
  })
  notes?: string;
}
