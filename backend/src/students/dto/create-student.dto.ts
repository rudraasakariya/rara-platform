import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The first name of the student' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The last name of the student' })
  lastName: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The site ID that the student belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  siteId: string;
}
