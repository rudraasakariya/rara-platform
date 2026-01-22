import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { SearchPartnersQueryDto } from './dto/search-partners-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles/roles.enum';
import { MessageCode, Messages } from '../common/messages';

@Controller('partners')
@UseGuards(JwtAuthGuard)
@ApiTags('Partners')
@ApiBearerAuth()
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiBody({ type: CreatePartnerDto })
  @ApiResponse({ status: 201, description: 'Partner created successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  async createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    return this.partnersService.createPartner(createPartnerDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all partners with optional filters',
    description: 'Get all partners. Supports optional filtering by active status and type. All authenticated users can view partners.'
  })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter partners by active status' })
  @ApiQuery({ name: 'type', required: false, enum: ['School', 'Co', 'Organization', 'Other'], description: 'Filter partners by type' })
  @ApiResponse({ status: 200, description: 'Partners fetched successfully' })
  @ApiBearerAuth()
  async getPartners(@Query() query: SearchPartnersQueryDto) {
    return this.partnersService.getPartners(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a partner by id' })
  @ApiParam({ name: 'id', description: 'The id of the partner' })
  @ApiResponse({ status: 200, description: 'Partner fetched successfully' })
  @ApiBearerAuth()
  async getPartnerById(@Param('id') id: string) {
    return this.partnersService.getPartnerById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a partner by id' })
  @ApiParam({ name: 'id', description: 'The id of the partner' })
  @ApiBody({ type: UpdatePartnerDto })
  @ApiResponse({ status: 200, description: 'Partner updated successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  async updatePartner(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnersService.updatePartner(id, updatePartnerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a partner by id' })
  @ApiParam({ name: 'id', description: 'The id of the partner' })
  @ApiResponse({ status: 200, description: 'Partner deleted successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  async deletePartner(@Param('id') id: string) {
    return this.partnersService.deletePartner(id);
  }
}
