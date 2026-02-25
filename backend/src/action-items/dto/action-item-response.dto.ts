import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class UserSummaryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ nullable: true })
  firstName: string | null;

  @Expose()
  @ApiProperty({ nullable: true })
  lastName: string | null;

  @Expose()
  @ApiProperty()
  email: string;
}

@Exclude()
export class ActionItemResponseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty({ description: 'Student ID' })
  studentId: string;

  @Expose()
  @ApiProperty({ description: 'User who created this action item' })
  createdByUserId: string;

  @Expose()
  @Type(() => UserSummaryDto)
  @ApiProperty({ description: 'Creator user summary', nullable: true })
  createdByUser: UserSummaryDto | null;

  @Expose()
  @ApiProperty({ description: 'User ID this item is assigned to', nullable: true })
  assignedToUserId: string | null;

  @Expose()
  @Type(() => UserSummaryDto)
  @ApiProperty({ description: 'Assigned user summary', nullable: true })
  assignedToUser: UserSummaryDto | null;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: string | null;

  @Expose()
  @ApiProperty({ enum: ['pending', 'in_progress', 'completed', 'cancelled'] })
  status: string;

  @Expose()
  @ApiProperty({ nullable: true })
  dueDate: Date | null;

  @Expose()
  @ApiProperty({ nullable: true })
  completedAt: Date | null;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
