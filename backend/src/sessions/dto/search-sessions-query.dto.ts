import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsOptional, IsUUID } from 'class-validator';

const SESSION_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'] as const;

export class SearchSessionsQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by tutor ID (admin/super_admin only).',
    required: false,
  })
  tutorId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by site ID.',
    required: false,
  })
  siteId?: string;

  @IsOptional()
  @IsIn(SESSION_STATUSES)
  @ApiProperty({
    description: 'Filter by session status.',
    enum: SESSION_STATUSES,
    required: false,
  })
  status?: (typeof SESSION_STATUSES)[number];

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

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by curriculum grade ID.',
    required: false,
  })
  gradeId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by curriculum cluster ID.',
    required: false,
  })
  clusterId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by curriculum skill ID.',
    required: false,
  })
  skillId?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter by student ID assigned to the session.',
    required: false,
  })
  studentId?: string;
}
