import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurriculumService } from './curriculum.service';

@Controller('curriculum')
@UseGuards(JwtAuthGuard)
@ApiTags('Curriculum')
@ApiBearerAuth()
export class CurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('subjects')
  @ApiOperation({
    summary: 'List subjects',
    description: 'Returns all active subjects (services) for curriculum. Read-only.',
  })
  @ApiResponse({ status: 200, description: 'Subjects list' })
  getSubjects() {
    return this.curriculumService.getSubjects();
  }

  @Get('subjects/:subjectId/grades')
  @ApiOperation({
    summary: 'List grades for a subject',
    description: 'Returns grades for the given subject (service) ID.',
  })
  @ApiParam({ name: 'subjectId', description: 'Subject (service) UUID' })
  @ApiResponse({ status: 200, description: 'Grades list' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  getGradesBySubjectId(@Param('subjectId') subjectId: string) {
    return this.curriculumService.getGradesBySubjectId(subjectId);
  }

  @Get('subjects/:subjectId/grades/:gradeId/tree')
  @ApiOperation({
    summary: 'Get curriculum tree for a subject and grade',
    description:
      'Returns grade with domains, clusters, and skills for the given subject and grade.',
  })
  @ApiParam({ name: 'subjectId', description: 'Subject (service) UUID' })
  @ApiParam({ name: 'gradeId', description: 'Grade UUID' })
  @ApiResponse({ status: 200, description: 'Curriculum tree' })
  @ApiResponse({ status: 404, description: 'Subject or grade not found' })
  getTree(
    @Param('subjectId') subjectId: string,
    @Param('gradeId') gradeId: string,
  ) {
    return this.curriculumService.getTree(subjectId, gradeId);
  }

  @Get('grades/:gradeId/domains')
  @ApiOperation({
    summary: 'List domains for a grade',
    description: 'Returns domains for the given grade ID.',
  })
  @ApiParam({ name: 'gradeId', description: 'Grade UUID' })
  @ApiResponse({ status: 200, description: 'Domains list' })
  @ApiResponse({ status: 404, description: 'Grade not found' })
  getDomainsByGradeId(@Param('gradeId') gradeId: string) {
    return this.curriculumService.getDomainsByGradeId(gradeId);
  }

  @Get('domains/:domainId/clusters')
  @ApiOperation({
    summary: 'List clusters for a domain',
    description: 'Returns clusters for the given domain ID.',
  })
  @ApiParam({ name: 'domainId', description: 'Domain UUID' })
  @ApiResponse({ status: 200, description: 'Clusters list' })
  @ApiResponse({ status: 404, description: 'Domain not found' })
  getClustersByDomainId(@Param('domainId') domainId: string) {
    return this.curriculumService.getClustersByDomainId(domainId);
  }

  @Get('clusters/:clusterId/skills')
  @ApiOperation({
    summary: 'List skills for a cluster',
    description: 'Returns skills for the given cluster ID.',
  })
  @ApiParam({ name: 'clusterId', description: 'Cluster UUID' })
  @ApiResponse({ status: 200, description: 'Skills list' })
  @ApiResponse({ status: 404, description: 'Cluster not found' })
  getSkillsByClusterId(@Param('clusterId') clusterId: string) {
    return this.curriculumService.getSkillsByClusterId(clusterId);
  }
}
