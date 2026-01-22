import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SearchSitesQueryDto } from './dto/search-sites-query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/roles/roles.enum';
import { MessageCode, Messages } from '../common/messages';

@Controller('sites')
@UseGuards(JwtAuthGuard)
@ApiTags('Sites')
@ApiBearerAuth()
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new site' })
  @ApiBody({ type: CreateSiteDto })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  async createSite(@Body() createSiteDto: CreateSiteDto) {
    return this.sitesService.createSite(createSiteDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all sites with optional filters',
    description: 'Get all sites. Supports optional filtering by active status, city, and state. All authenticated users can view sites.'
  })
  @ApiQuery({ name: 'active', required: false, type: Boolean, description: 'Filter sites by active status' })
  @ApiQuery({ name: 'city', required: false, type: String, description: 'Filter sites by city' })
  @ApiQuery({ name: 'state', required: false, type: String, description: 'Filter sites by state' })
  @ApiResponse({ status: 200, description: 'Sites fetched successfully' })
  @ApiBearerAuth()
  async getSites(@Query() query: SearchSitesQueryDto) {
    return this.sitesService.getSites(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a site by id' })
  @ApiParam({ name: 'id', description: 'The id of the site' })
  @ApiResponse({ status: 200, description: 'Site fetched successfully' })
  @ApiBearerAuth()
  async getSiteById(@Param('id') id: string) {
    return this.sitesService.getSiteById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update a site by id' })
  @ApiParam({ name: 'id', description: 'The id of the site' })
  @ApiBody({ type: UpdateSiteDto })
  @ApiResponse({ status: 200, description: 'Site updated successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  async updateSite(@Param('id') id: string, @Body() updateSiteDto: UpdateSiteDto) {
    return this.sitesService.updateSite(id, updateSiteDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a site by id' })
  @ApiParam({ name: 'id', description: 'The id of the site' })
  @ApiResponse({ status: 200, description: 'Site deleted successfully' })
  @ApiForbiddenResponse({
    description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS],
  })
  @ApiBearerAuth()
  async deleteSite(@Param('id') id: string) {
    return this.sitesService.deleteSite(id);
  }
}
