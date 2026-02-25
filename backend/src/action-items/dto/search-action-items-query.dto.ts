import { IsOptional, IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionItemStatus } from './create-action-item.dto';

export class SearchActionItemsQueryDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({ description: 'Filter by student ID', required: false, format: 'uuid' })
  studentId?: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Filter by assigned user ID',
    required: false,
    format: 'uuid',
  })
  assignedToUserId?: string;

  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  @IsOptional()
  @ApiProperty({
    description: 'Filter by status',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    required: false,
  })
  status?: ActionItemStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter items due on or after this date',
    required: false,
    example: '2025-01-01',
  })
  dueDateFrom?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Filter items due on or before this date',
    required: false,
    example: '2025-12-31',
  })
  dueDateTo?: string;
}
