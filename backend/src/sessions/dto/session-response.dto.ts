import { ApiProperty } from '@nestjs/swagger';

export class SessionResponseDto {
  @ApiProperty({ description: 'Session ID' })
  id: string;

  @ApiProperty({ description: 'Tutor user ID' })
  tutorId: string;

  @ApiProperty({ description: 'Site ID' })
  siteId: string;

  @ApiProperty({ description: 'Curriculum grade ID', nullable: true })
  gradeId: string | null;

  @ApiProperty({ description: 'Curriculum grade code', nullable: true })
  gradeCode: string | null;

  @ApiProperty({ description: 'Curriculum grade label', nullable: true })
  gradeLabel: string | null;

  @ApiProperty({ description: 'Curriculum cluster ID', nullable: true })
  clusterId: string | null;

  @ApiProperty({ description: 'Curriculum cluster code', nullable: true })
  clusterCode: string | null;

  @ApiProperty({ description: 'Curriculum cluster label', nullable: true })
  clusterLabel: string | null;

  @ApiProperty({ description: 'Curriculum skill ID', nullable: true })
  skillId: string | null;

  @ApiProperty({ description: 'Curriculum skill code', nullable: true })
  skillCode: string | null;

  @ApiProperty({ description: 'Curriculum skill label', nullable: true })
  skillLabel: string | null;

  @ApiProperty({ description: 'Session date' })
  sessionDate: Date;

  @ApiProperty({ description: 'Scheduled start time', nullable: true })
  scheduledStartTime: string | null;

  @ApiProperty({ description: 'Actual start time', nullable: true })
  actualStartTime: string | null;

  @ApiProperty({ description: 'Actual end time', nullable: true })
  actualEndTime: string | null;

  @ApiProperty({
    description: 'Session status',
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'],
  })
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

  @ApiProperty({ description: 'Duration in minutes', nullable: true })
  minutes: number | null;

  @ApiProperty({ description: 'Notes', nullable: true })
  notes: string | null;

  @ApiProperty({ description: 'Student IDs for this session', type: [String] })
  studentIds: string[];

  @ApiProperty({ description: 'Student count for this session' })
  studentCount: number;

  @ApiProperty({ description: 'Session creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Session update timestamp' })
  updatedAt: Date;
}
