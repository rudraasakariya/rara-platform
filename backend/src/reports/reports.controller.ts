import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';
import { CoverageQueryDto } from './dto/coverage-query.dto';
import { CoverageResponseDto } from './dto/coverage-response.dto';
import { TrendQueryDto } from './dto/trend-query.dto';
import { TrendResponseDto } from './dto/trend-response.dto';

@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiTags('Reports')
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('coverage')
  @ApiOperation({
    summary: 'Skill coverage report',
    description:
      'Returns the percentage of curriculum skills covered in at least one session, ' +
      'filtered by tutor, site, subject, grade, domain, and date range.',
  })
  @ApiResponse({ status: 200, type: CoverageResponseDto, description: 'Coverage data' })
  getCoverage(@Query() query: CoverageQueryDto): Promise<CoverageResponseDto> {
    return this.reportsService.getCoverage(query);
  }

  @Get('trend')
  @ApiOperation({
    summary: 'Session and skill trend over time',
    description:
      'Returns time-series data (week or month) with session count and distinct skills ' +
      'covered per period. Same filters as coverage plus groupBy=week|month.',
  })
  @ApiResponse({ status: 200, type: TrendResponseDto, description: 'Trend data' })
  getTrend(@Query() query: TrendQueryDto): Promise<TrendResponseDto> {
    return this.reportsService.getTrend(query);
  }
}
