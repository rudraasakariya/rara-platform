import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchTutorsQueryDto {
  @IsOptional()
  @IsEnum(['active', 'inactive', 'on_leave'])
  @ApiProperty({
    description: 'Filter tutors by status',
    enum: ['active', 'inactive', 'on_leave'],
    required: false,
    example: 'active',
  })
  status?: 'active' | 'inactive' | 'on_leave';
}

