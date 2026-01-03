import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../database/entities/user.entity';

@Exclude()
export class TutorResponseDto {
  @Expose()
  @ApiProperty({ description: 'The user ID of the tutor' })
  userId: string;

  @Expose()
  @ApiProperty({ description: 'The user information of the tutor', type: () => User })
  user: User;

  @Expose()
  @ApiProperty({ description: 'Maximum number of students the tutor can handle' })
  maxLoad: number;

  @Expose()
  @ApiProperty({ description: 'The hire date of the tutor', nullable: true, type: 'string', format: 'date' })
  hireDate: Date | null;

  @Expose()
  @ApiProperty({ description: 'The status of the tutor' })
  status: 'active' | 'inactive' | 'on_leave';

  @Expose()
  @ApiProperty({ description: 'The created at timestamp' })
  createdAt: Date;

  @Expose()
  @ApiProperty({ description: 'The updated at timestamp' })
  updatedAt: Date;
}

