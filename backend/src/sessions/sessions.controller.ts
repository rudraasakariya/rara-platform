import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/roles/roles.enum';
import { User } from '../database/entities/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SearchSessionsQueryDto } from './dto/search-sessions-query.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { MessageCode, Messages } from '../common/messages';

@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiTags('Sessions')
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a session with students and taxonomy selection' })
  @ApiBody({ type: CreateSessionDto })
  @ApiResponse({ status: 201, description: 'Session created', type: SessionResponseDto })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
    @CurrentUser() user: User,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.createSession(createSessionDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List sessions with optional tutor/site/date/taxonomy filters' })
  @ApiQuery({ name: 'tutorId', required: false })
  @ApiQuery({ name: 'siteId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'no_show'] })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'gradeId', required: false })
  @ApiQuery({ name: 'clusterId', required: false })
  @ApiQuery({ name: 'skillId', required: false })
  @ApiResponse({ status: 200, description: 'Sessions fetched', type: [SessionResponseDto] })
  async getSessions(
    @Query() query: SearchSessionsQueryDto,
    @CurrentUser() user: User,
  ): Promise<SessionResponseDto[]> {
    return this.sessionsService.getSessions(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session fetched', type: SessionResponseDto })
  async getSessionById(@Param('id') id: string, @CurrentUser() user: User): Promise<SessionResponseDto> {
    return this.sessionsService.getSessionById(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiBody({ type: UpdateSessionDto })
  @ApiResponse({ status: 200, description: 'Session updated', type: SessionResponseDto })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  async updateSession(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
    @CurrentUser() user: User,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.updateSession(id, updateSessionDto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a session by ID' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session deleted' })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  async deleteSession(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.sessionsService.deleteSession(id, user);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Get students in a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiResponse({ status: 200, description: 'Session students fetched' })
  async getSessionStudents(@Param('id') id: string, @CurrentUser() user: User) {
    return this.sessionsService.getSessionStudents(id, user);
  }

  @Post(':id/students/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Add a student to a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student added to session' })
  async addStudentToSession(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.addStudentToSession(id, studentId, user);
  }

  @Delete(':id/students/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Remove a student from a session' })
  @ApiParam({ name: 'id', description: 'Session ID' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student removed from session' })
  async removeStudentFromSession(
    @Param('id') id: string,
    @Param('studentId') studentId: string,
    @CurrentUser() user: User,
  ) {
    return this.sessionsService.removeStudentFromSession(id, studentId, user);
  }
}
