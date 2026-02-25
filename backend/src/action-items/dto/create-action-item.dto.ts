import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type ActionItemStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export class CreateActionItemDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'Student ID this action item belongs to', format: 'uuid' })
  studentId: string;

  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'User ID to assign this action item to',
    required: false,
    nullable: true,
    format: 'uuid',
  })
  assignedToUserId?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty({ description: 'Title of the action item', maxLength: 500 })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Detailed description', required: false, nullable: true })
  description?: string;

  @IsEnum(['pending', 'in_progress', 'completed', 'cancelled'])
  @IsOptional()
  @ApiProperty({
    description: 'Status of the action item',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
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
  dueDate?: string;
}
