import { ApiProperty } from '@nestjs/swagger';

export class TrendPeriodDto {
  @ApiProperty({ description: 'Period label (e.g. "2025-W03" or "2025-03")' })
  period: string;

  @ApiProperty({ description: 'Start date of this period (ISO string)' })
  periodStart: string;

  @ApiProperty({ description: 'Number of sessions in this period' })
  sessionCount: number;

  @ApiProperty({ description: 'Number of distinct skills covered in this period' })
  skillsCovered: number;
}

export class TrendResponseDto {
  @ApiProperty({ enum: ['week', 'month'], description: 'Grouping granularity used' })
  groupBy: 'week' | 'month';

  @ApiProperty({ type: [TrendPeriodDto], description: 'Time-series data points' })
  data: TrendPeriodDto[];
}
