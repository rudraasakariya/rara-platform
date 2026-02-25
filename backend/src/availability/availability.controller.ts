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
import { AvailabilityService } from './availability.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/roles/roles.enum';
import { User } from '../database/entities/user.entity';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { SearchAvailabilityQueryDto } from './dto/search-availability-query.dto';
import { AvailabilityResponseDto } from './dto/availability-response.dto';
import { MessageCode, Messages } from '../common/messages';

@Controller('availability')
@UseGuards(JwtAuthGuard)
@ApiTags('Availability')
@ApiBearerAuth()
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create an availability slot' })
  @ApiBody({ type: CreateAvailabilityDto })
  @ApiResponse({ status: 201, description: 'Availability slot created', type: AvailabilityResponseDto })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  async create(
    @Body() dto: CreateAvailabilityDto,
    @CurrentUser() user: User,
  ): Promise<AvailabilityResponseDto> {
    return this.availabilityService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'List availability slots with optional filters' })
  @ApiQuery({ name: 'tutorId', required: false })
  @ApiQuery({ name: 'dayOfWeek', required: false, description: '0=Sunday, 6=Saturday' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({ status: 200, description: 'Availability slots fetched', type: [AvailabilityResponseDto] })
  async getAll(
    @Query() query: SearchAvailabilityQueryDto,
    @CurrentUser() user: User,
  ): Promise<AvailabilityResponseDto[]> {
    return this.availabilityService.getAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an availability slot by ID' })
  @ApiParam({ name: 'id', description: 'Availability ID' })
  @ApiResponse({ status: 200, description: 'Availability slot fetched', type: AvailabilityResponseDto })
  async getById(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<AvailabilityResponseDto> {
    return this.availabilityService.getById(id, user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an availability slot by ID' })
  @ApiParam({ name: 'id', description: 'Availability ID' })
  @ApiBody({ type: UpdateAvailabilityDto })
  @ApiResponse({ status: 200, description: 'Availability slot updated', type: AvailabilityResponseDto })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAvailabilityDto,
    @CurrentUser() user: User,
  ): Promise<AvailabilityResponseDto> {
    return this.availabilityService.update(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.TUTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an availability slot by ID' })
  @ApiParam({ name: 'id', description: 'Availability ID' })
  @ApiResponse({ status: 200, description: 'Availability slot deleted' })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.availabilityService.delete(id, user);
  }
}
