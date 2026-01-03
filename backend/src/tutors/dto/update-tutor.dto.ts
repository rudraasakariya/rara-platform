import { IsOptional, IsInt, Min, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTutorDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Maximum number of students the tutor can handle',
    example: 15,
    required: false,
  })
  maxLoad?: number;

  @IsOptional()
  @IsDateString()
  @ApiProperty({
    description: 'The hire date of the tutor (YYYY-MM-DD)',
    required: false,
    type: 'string',
    format: 'date',
  })
  hireDate?: Date;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'on_leave'])
  @ApiProperty({
    description: 'The status of the tutor',
    enum: ['active', 'inactive', 'on_leave'],
    required: false,
    example: 'active',
  })
  status?: 'active' | 'inactive' | 'on_leave';
}

