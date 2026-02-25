import { IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CoverageQueryDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Filter by tutor user ID', required: false, format: 'uuid' })
  tutorId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Filter by site ID', required: false, format: 'uuid' })
  siteId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Filter by subject (service) ID', required: false, format: 'uuid' })
  subjectId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Filter by grade ID', required: false, format: 'uuid' })
  gradeId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Filter by domain ID', required: false, format: 'uuid' })
  domainId?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Sessions on or after this date',
    required: false,
    example: '2025-01-01',
  })
  from?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Sessions on or before this date',
    required: false,
    example: '2025-12-31',
  })
  to?: string;
}
