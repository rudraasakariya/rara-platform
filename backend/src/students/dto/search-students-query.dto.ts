import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchStudentsQueryDto {
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'Filter students by site ID',
    required: false,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  siteId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter students by status',
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    required: false,
    example: 'active',
  })
  status?: 'active' | 'inactive' | 'graduated' | 'transferred';

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Filter students by case/support status',
    enum: ['active', 'resolved', 'needsAD', 'support'],
    required: false,
    example: 'active',
  })
  caseStatus?: 'active' | 'resolved' | 'needsAD' | 'support';
}
