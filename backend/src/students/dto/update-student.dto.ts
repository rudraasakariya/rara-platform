import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStudentDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ 
    description: 'The first name of the student',
    required: false,
    maxLength: 100
  })
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ 
    description: 'The last name of the student',
    required: false,
    maxLength: 100
  })
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ 
    description: 'The gender of the student',
    required: false,
    nullable: true
  })
  gender?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ 
    description: 'The date of birth of the student (YYYY-MM-DD)',
    required: false,
    nullable: true,
    example: '2010-05-15'
  })
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @ApiProperty({ 
    description: 'The grade level of the student',
    required: false,
    nullable: true
  })
  gradeLevel?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: 'The site ID that the student belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  siteId?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'graduated', 'transferred'])
  @ApiProperty({ 
    description: 'The status of the student',
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    required: false,
    example: 'active'
  })
  status?: 'active' | 'inactive' | 'graduated' | 'transferred';

  @IsOptional()
  @IsString()
  @ApiProperty({ 
    description: 'Notes about the student',
    required: false,
    nullable: true
  })
  notes?: string;

  @IsOptional()
  @IsEnum(['active', 'resolved', 'needsAD', 'support'])
  @ApiProperty({
    description: 'Case/support status of the student',
    enum: ['active', 'resolved', 'needsAD', 'support'],
    required: false,
    example: 'active',
  })
  caseStatus?: 'active' | 'resolved' | 'needsAD' | 'support';
}
