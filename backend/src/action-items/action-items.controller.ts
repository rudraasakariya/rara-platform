import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../common/roles/roles.enum';
import { Messages, MessageCode } from '../common/messages';
import { ActionItemsService } from './action-items.service';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';
import { SearchActionItemsQueryDto } from './dto/search-action-items-query.dto';
import { User } from '../database/entities/user.entity';

@Controller('action-items')
@UseGuards(JwtAuthGuard)
@ApiTags('Action Items')
@ApiBearerAuth()
export class ActionItemsController {
  constructor(private readonly actionItemsService: ActionItemsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create an action item (admin/super_admin only)' })
  @ApiBody({ type: CreateActionItemDto })
  @ApiResponse({ status: 201, description: 'Action item created successfully' })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  create(@Body() dto: CreateActionItemDto, @CurrentUser() currentUser: User) {
    return this.actionItemsService.create(dto, currentUser);
  }

  @Get()
  @ApiOperation({
    summary: 'List action items',
    description: 'All authenticated users can list. Filter by studentId, assignedToUserId, status, dueDateFrom, dueDateTo.',
  })
  @ApiResponse({ status: 200, description: 'Action items fetched successfully' })
  getAll(@Query() query: SearchActionItemsQueryDto) {
    return this.actionItemsService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an action item by ID' })
  @ApiParam({ name: 'id', description: 'Action item UUID' })
  @ApiResponse({ status: 200, description: 'Action item fetched successfully' })
  @ApiResponse({ status: 404, description: 'Action item not found' })
  getById(@Param('id', ParseUUIDPipe) id: string) {
    return this.actionItemsService.getById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update an action item (admin/super_admin only)' })
  @ApiParam({ name: 'id', description: 'Action item UUID' })
  @ApiBody({ type: UpdateActionItemDto })
  @ApiResponse({ status: 200, description: 'Action item updated successfully' })
  @ApiResponse({ status: 404, description: 'Action item not found' })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateActionItemDto,
  ) {
    return this.actionItemsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an action item (admin/super_admin only)' })
  @ApiParam({ name: 'id', description: 'Action item UUID' })
  @ApiResponse({ status: 204, description: 'Action item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Action item not found' })
  @ApiForbiddenResponse({ description: Messages[MessageCode.INSUFFICIENT_PERMISSIONS] })
  delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.actionItemsService.delete(id);
  }
}
