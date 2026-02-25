import {
  IsString,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ActionItemStatus } from './create-action-item.dto';

export class UpdateActionItemDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'User ID to assign this action item to',
    required: false,
    nullable: true,
    format: 'uuid',
  })
  assignedToUserId?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  @ApiProperty({ description: 'Title of the action item', required: false, maxLength: 500 })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Detailed description', required: false, nullable: true })
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  @IsOptional()
  @ApiProperty({
    description: 'Status of the action item',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    required: false,
  })
  status?: ActionItemStatus;

  @IsDateString()
  @IsOptional()
  @ApiProperty({
    description: 'Due date (ISO date string)',
    required: false,
    nullable: true,
    example: '2025-12-31',
  })
  dueDate?: string | null;
}
