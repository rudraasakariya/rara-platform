import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles/roles.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { UpdateStudentDto } from './dto/update-student.dto';
import { SearchStudentsQueryDto } from './dto/search-students-query.dto';
import { MessageCode, Messages } from '../common/messages';

@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiTags('Students')
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new student' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.createStudent(createStudentDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all students with optional filters',
    description: 'Get all students. Supports optional filtering by siteId and status. Tutors can only see students assigned to them. Name-based search should be handled on the frontend.'
  })
  @ApiQuery({ name: 'siteId', required: false, description: 'Filter students by site ID' })
  @ApiQuery({ name: 'tutorId', required: false, description: 'Filter students by assigned tutor ID (admin/super_admin only)' })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'graduated', 'transferred'], description: 'Filter students by status' })
  @ApiQuery({ name: 'caseStatus', required: false, enum: ['active', 'resolved', 'needsAD', 'support'], description: 'Filter students by case/support status' })
  @ApiResponse({ status: 200, description: 'Students fetched successfully' })
  @ApiBearerAuth()
  async getStudents(@Query() query: SearchStudentsQueryDto, @CurrentUser() user: User) {
    return this.studentsService.getStudents(query, user);
  }

  @Get('site/:siteId/students')
  @ApiOperation({ summary: 'Get all students by site id' })
  @ApiParam({ name: 'siteId', description: 'The id of the site' })
  @ApiResponse({ status: 200, description: 'Students fetched successfully' })
  @ApiBearerAuth()
  async getStudentsBySiteId(@Param('siteId') siteId: string, @CurrentUser() user: User) {
    return this.studentsService.getStudentsBySiteId(siteId, user);
  }

  @Get('site/:siteId/students/:studentId')
  @ApiOperation({ summary: 'Get a student by site id and student id' })
  @ApiParam({ name: 'siteId', description: 'The id of the site' })
  @ApiParam({ name: 'studentId', description: 'The id of the student' })
  @ApiResponse({ status: 200, description: 'Student fetched successfully' })
  @ApiBearerAuth()
  async getStudentBySiteIdAndStudentId(@Param('siteId') siteId: string, @Param('studentId') studentId: string, @CurrentUser() user: User) {
    return this.studentsService.getStudentBySiteIdAndStudentId(siteId, studentId, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student by id' })
  @ApiParam({ name: 'id', description: 'The id of the student' })
  @ApiResponse({ status: 200, description: 'Student fetched successfully' })
  @ApiBearerAuth()
  async getStudentById(@Param('id') id: string, @CurrentUser() user: User) {
    return this.studentsService.getStudentById(id, user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a student by id' })
  @ApiParam({ name: 'id', description: 'The id of the student' })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  async updateStudent(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto, @CurrentUser() user: User) {
    return this.studentsService.updateStudent(id, updateStudentDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a student by id' })
  @ApiParam({ name: 'id', description: 'The id of the student' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  async deleteStudent(@Param('id') id: string) {
    return this.studentsService.deleteStudent(id);
  }
}
