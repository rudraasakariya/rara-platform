import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ActionItem } from '../database/entities/action-item.entity';
import { User } from '../database/entities/user.entity';
import { CreateActionItemDto } from './dto/create-action-item.dto';
import { UpdateActionItemDto } from './dto/update-action-item.dto';
import { ActionItemResponseDto } from './dto/action-item-response.dto';
import { SearchActionItemsQueryDto } from './dto/search-action-items-query.dto';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class ActionItemsService {
  constructor(
    @InjectRepository(ActionItem)
    private readonly actionItemRepository: Repository<ActionItem>,
  ) {}

  async create(dto: CreateActionItemDto, currentUser: User): Promise<ActionItemResponseDto> {
    const actionItem = this.actionItemRepository.create({
      studentId: dto.studentId,
      createdByUserId: currentUser.id,
      assignedToUserId: dto.assignedToUserId ?? null,
      title: dto.title,
      description: dto.description ?? null,
      status: dto.status ?? 'pending',
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
    });

    const saved = await this.actionItemRepository.save(actionItem);
    return this.getById(saved.id);
  }

  async getAll(query?: SearchActionItemsQueryDto): Promise<ActionItemResponseDto[]> {
    const qb = this.actionItemRepository
      .createQueryBuilder('ai')
      .leftJoinAndSelect('ai.createdByUser', 'createdByUser')
      .leftJoinAndSelect('ai.assignedToUser', 'assignedToUser')
      .orderBy('ai.createdAt', 'DESC');

    if (query?.studentId) {
      qb.andWhere('ai.studentId = :studentId', { studentId: query.studentId });
    }

    if (query?.assignedToUserId) {
      qb.andWhere('ai.assignedToUserId = :assignedToUserId', {
        assignedToUserId: query.assignedToUserId,
      });
    }

    if (query?.status) {
      qb.andWhere('ai.status = :status', { status: query.status });
    }

    if (query?.dueDateFrom) {
      qb.andWhere('ai.dueDate >= :dueDateFrom', { dueDateFrom: query.dueDateFrom });
    }

    if (query?.dueDateTo) {
      qb.andWhere('ai.dueDate <= :dueDateTo', { dueDateTo: query.dueDateTo });
    }

    const items = await qb.getMany();
    return items.map((item) =>
      plainToInstance(ActionItemResponseDto, item, { excludeExtraneousValues: true }),
    );
  }

  async getById(id: string): Promise<ActionItemResponseDto> {
    const item = await this.actionItemRepository.findOne({
      where: { id },
      relations: ['createdByUser', 'assignedToUser'],
    });

    if (!item) {
      throw new NotFoundException(Messages[MessageCode.ACTION_ITEM_NOT_FOUND]);
    }

    return plainToInstance(ActionItemResponseDto, item, { excludeExtraneousValues: true });
  }

  async update(id: string, dto: UpdateActionItemDto): Promise<ActionItemResponseDto> {
    const item = await this.actionItemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(Messages[MessageCode.ACTION_ITEM_NOT_FOUND]);
    }

    if (dto.title !== undefined) item.title = dto.title;
    if (dto.description !== undefined) item.description = dto.description ?? null;
    if (dto.assignedToUserId !== undefined) item.assignedToUserId = dto.assignedToUserId ?? null;
    if (dto.status !== undefined) {
      item.status = dto.status;
      if (dto.status === 'completed' && !item.completedAt) {
        item.completedAt = new Date();
      } else if (dto.status !== 'completed') {
        item.completedAt = null;
      }
    }
    if (dto.dueDate !== undefined) {
      item.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }

    await this.actionItemRepository.save(item);
    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    const item = await this.actionItemRepository.findOne({ where: { id } });

    if (!item) {
      throw new NotFoundException(Messages[MessageCode.ACTION_ITEM_NOT_FOUND]);
    }

    await this.actionItemRepository.delete(id);
  }
}
