import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Site } from '../../database/entities/site.entity';

@Exclude()
export class StudentResponseDto {
  @Expose()
  @ApiProperty({ description: 'The id of the student' })
  id: string;

  @Expose()
  @ApiProperty({ description: 'The first name of the student' })
  firstName: string;

  @Expose()
  @ApiProperty({ description: 'The last name of the student' })
  lastName: string;

  @Expose()
  @ApiProperty({ description: 'The gender of the student', nullable: true, required: false })
  gender: string | null;

  @Expose()
  @ApiProperty({ description: 'The date of birth of the student', nullable: true, required: false })
  dateOfBirth: Date | null;

  @Expose()
  @ApiProperty({ description: 'The grade level of the student', nullable: true, required: false })
  gradeLevel: string | null;

  @Expose()
  @ApiProperty({ description: 'The site id of the student' })
  siteId: string;

  @Expose()
  @ApiProperty({ description: 'The site of the student', nullable: true, required: false })
  site: Site | null;

  @Expose()
  @ApiProperty({ 
    description: 'The status of the student',
    enum: ['active', 'inactive', 'graduated', 'transferred'],
    example: 'active'
  })
  status: 'active' | 'inactive' | 'graduated' | 'transferred';

  @Expose()
  @ApiProperty({ description: 'Notes about the student', nullable: true, required: false })
  notes: string | null;

  @Expose()
  @ApiProperty({
    description: 'Case/support status of the student',
    enum: ['active', 'resolved', 'needsAD', 'support'],
    example: 'active',
  })
  caseStatus: 'active' | 'resolved' | 'needsAD' | 'support';

  @Expose()
  @ApiProperty({ description: 'The created at timestamp of the student' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The updated at timestamp of the student' })
  updatedAt: Date;
}
