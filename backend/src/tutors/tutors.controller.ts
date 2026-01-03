import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { CreateTutorDto } from './dto/create-tutor.dto';
import { UpdateTutorDto } from './dto/update-tutor.dto';
import { TutorResponseDto } from './dto/tutor-response.dto';
import { SearchTutorsQueryDto } from './dto/search-tutors-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles/roles.enum';
import { MessageCode, Messages } from '../common/messages';

@Controller('tutors')
@UseGuards(JwtAuthGuard)
@ApiTags('Tutors')
@ApiBearerAuth()
export class TutorsController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new tutor (assign user as tutor)' })
  @ApiBody({ type: CreateTutorDto })
  @ApiResponse({ status: 201, description: 'Tutor created successfully', type: TutorResponseDto })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  async createTutor(@Body() createTutorDto: CreateTutorDto): Promise<TutorResponseDto> {
    return this.tutorsService.createTutor(createTutorDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all tutors with optional filters',
    description: 'Get all tutors. Supports optional filtering by status. All authenticated users can view tutors.',
  })
  @ApiQuery({ name: 'status', required: false, enum: ['active', 'inactive', 'on_leave'], description: 'Filter tutors by status' })
  @ApiResponse({ status: 200, description: 'Tutors fetched successfully', type: [TutorResponseDto] })
  async getTutors(@Query() query: SearchTutorsQueryDto): Promise<TutorResponseDto[]> {
    return this.tutorsService.getTutors(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tutor by user ID' })
  @ApiParam({ name: 'id', description: 'The user ID of the tutor' })
  @ApiResponse({ status: 200, description: 'Tutor fetched successfully', type: TutorResponseDto })
  async getTutorById(@Param('id') id: string): Promise<TutorResponseDto> {
    return this.tutorsService.getTutorById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a tutor by user ID' })
  @ApiParam({ name: 'id', description: 'The user ID of the tutor' })
  @ApiBody({ type: UpdateTutorDto })
  @ApiResponse({ status: 200, description: 'Tutor updated successfully', type: TutorResponseDto })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  async updateTutor(@Param('id') id: string, @Body() updateTutorDto: UpdateTutorDto): Promise<TutorResponseDto> {
    return this.tutorsService.updateTutor(id, updateTutorDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a tutor by user ID' })
  @ApiParam({ name: 'id', description: 'The user ID of the tutor' })
  @ApiResponse({ status: 200, description: 'Tutor deleted successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  async deleteTutor(@Param('id') id: string): Promise<void> {
    return this.tutorsService.deleteTutor(id);
  }

  @Get(':id/students')
  @ApiOperation({ summary: 'Get all students assigned to a tutor' })
  @ApiParam({ name: 'id', description: 'The user ID of the tutor' })
  @ApiResponse({ status: 200, description: 'Students fetched successfully' })
  async getTutorStudents(@Param('id') id: string): Promise<any[]> {
    return this.tutorsService.getTutorStudents(id);
  }
}

