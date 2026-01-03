import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The user ID to assign as a tutor',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  userId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Maximum number of students the tutor can handle',
    example: 10,
    required: false,
    default: 10,
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
}

