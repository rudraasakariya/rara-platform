import { ApiProperty } from '@nestjs/swagger';

export class AvailabilityResponseDto {
  @ApiProperty({ description: 'Availability ID' })
  id: string;

  @ApiProperty({ description: 'Tutor user ID' })
  tutorId: string;

  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)', nullable: true })
  dayOfWeek: number | null;

  @ApiProperty({ description: 'Start time (HH:mm)' })
  startTime: string;

  @ApiProperty({ description: 'End time (HH:mm)' })
  endTime: string;

  @ApiProperty({ description: 'Whether this is a recurring weekly slot' })
  isRecurring: boolean;

  @ApiProperty({ description: 'Specific date for one-off slots', nullable: true })
  specificDate: string | null;

  @ApiProperty({ description: 'Effective from date for recurring slots', nullable: true })
  effectiveFrom: string | null;

  @ApiProperty({ description: 'Effective until date for recurring slots', nullable: true })
  effectiveUntil: string | null;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;
}
