import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Availability } from '../database/entities/availability.entity';
import { Tutor } from '../database/entities/tutor.entity';
import { User } from '../database/entities/user.entity';
import { Role } from '../common/roles/roles.enum';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { SearchAvailabilityQueryDto } from './dto/search-availability-query.dto';
import { AvailabilityResponseDto } from './dto/availability-response.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Availability)
    private readonly availabilityRepository: Repository<Availability>,
    @InjectRepository(Tutor)
    private readonly tutorRepository: Repository<Tutor>,
  ) {}

  async create(dto: CreateAvailabilityDto, currentUser: User): Promise<AvailabilityResponseDto> {
    const tutorId = await this.resolveCreateTutorId(dto.tutorId, currentUser);
    const isRecurring = dto.isRecurring ?? true;

    this.validateRecurringConstraints(isRecurring, dto.dayOfWeek, dto.specificDate);

    const availability = this.availabilityRepository.create({
      tutorId,
      dayOfWeek: isRecurring ? dto.dayOfWeek : null,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isRecurring,
      specificDate: !isRecurring && dto.specificDate ? new Date(dto.specificDate) : null,
      effectiveFrom: dto.effectiveFrom ? new Date(dto.effectiveFrom) : null,
      effectiveUntil: dto.effectiveUntil ? new Date(dto.effectiveUntil) : null,
    });

    const saved = await this.availabilityRepository.save(availability);
    return this.mapToResponse(saved);
  }

  async getAll(query: SearchAvailabilityQueryDto, currentUser: User): Promise<AvailabilityResponseDto[]> {
    const qb = this.availabilityRepository.createQueryBuilder('availability');

    if (currentUser.role === Role.TUTOR) {
      qb.andWhere('availability.tutorId = :tutorId', { tutorId: currentUser.id });
    } else if (query?.tutorId) {
      qb.andWhere('availability.tutorId = :tutorId', { tutorId: query.tutorId });
    }

    if (query?.dayOfWeek !== undefined) {
      qb.andWhere('availability.dayOfWeek = :dayOfWeek', { dayOfWeek: query.dayOfWeek });
    }

    if (query?.startDate) {
      qb.andWhere('availability.specificDate >= :startDate', { startDate: query.startDate });
    }

    if (query?.endDate) {
      qb.andWhere('availability.specificDate <= :endDate', { endDate: query.endDate });
    }

    qb.orderBy('availability.createdAt', 'DESC');

    const records = await qb.getMany();
    return records.map((a) => this.mapToResponse(a));
  }

  async getById(id: string, currentUser: User): Promise<AvailabilityResponseDto> {
    const availability = await this.findForAccess(id, currentUser);
    return this.mapToResponse(availability);
  }

  async update(id: string, dto: UpdateAvailabilityDto, currentUser: User): Promise<AvailabilityResponseDto> {
    const availability = await this.findForAccess(id, currentUser);

    if (dto.tutorId !== undefined && currentUser.role !== Role.TUTOR) {
      await this.ensureTutorExists(dto.tutorId);
      availability.tutorId = dto.tutorId;
    }

    const isRecurring = dto.isRecurring !== undefined ? dto.isRecurring : availability.isRecurring;

    // Determine the effective dayOfWeek and specificDate after update
    const newDayOfWeek = dto.dayOfWeek !== undefined ? dto.dayOfWeek : availability.dayOfWeek;
    const newSpecificDate =
      dto.specificDate !== undefined
        ? dto.specificDate
        : availability.specificDate
          ? availability.specificDate.toISOString().split('T')[0]
          : undefined;

    this.validateRecurringConstraints(isRecurring, newDayOfWeek, newSpecificDate);

    if (dto.startTime !== undefined) availability.startTime = dto.startTime;
    if (dto.endTime !== undefined) availability.endTime = dto.endTime;
    availability.isRecurring = isRecurring;

    if (isRecurring) {
      availability.dayOfWeek = newDayOfWeek ?? null;
      availability.specificDate = null;
    } else {
      availability.dayOfWeek = null;
      availability.specificDate = newSpecificDate ? new Date(newSpecificDate) : null;
    }

    if (dto.effectiveFrom !== undefined) {
      availability.effectiveFrom = dto.effectiveFrom ? new Date(dto.effectiveFrom) : null;
    }
    if (dto.effectiveUntil !== undefined) {
      availability.effectiveUntil = dto.effectiveUntil ? new Date(dto.effectiveUntil) : null;
    }

    const saved = await this.availabilityRepository.save(availability);
    return this.mapToResponse(saved);
  }

  async delete(id: string, currentUser: User): Promise<void> {
    await this.findForAccess(id, currentUser);
    await this.availabilityRepository.delete(id);
  }

  private async findForAccess(id: string, currentUser: User): Promise<Availability> {
    const availability = await this.availabilityRepository.findOne({ where: { id } });

    if (!availability) {
      throw new NotFoundException('Availability slot not found');
    }

    if (currentUser.role === Role.TUTOR && availability.tutorId !== currentUser.id) {
      throw new NotFoundException('Availability slot not found');
    }

    return availability;
  }

  private async resolveCreateTutorId(tutorId: string | undefined, currentUser: User): Promise<string> {
    if (currentUser.role === Role.TUTOR) {
      if (tutorId && tutorId !== currentUser.id) {
        throw new BadRequestException('Tutors can only create availability for themselves');
      }
      await this.ensureTutorExists(currentUser.id);
      return currentUser.id;
    }

    if (!tutorId) {
      throw new BadRequestException('tutorId is required for admin and super_admin users');
    }

    await this.ensureTutorExists(tutorId);
    return tutorId;
  }

  private async ensureTutorExists(tutorId: string): Promise<void> {
    const tutor = await this.tutorRepository.findOne({ where: { userId: tutorId } });
    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }
  }

  private validateRecurringConstraints(
    isRecurring: boolean,
    dayOfWeek: number | null | undefined,
    specificDate: string | null | undefined,
  ): void {
    if (isRecurring) {
      if (dayOfWeek === null || dayOfWeek === undefined) {
        throw new BadRequestException('dayOfWeek is required for recurring availability slots');
      }
      if (specificDate) {
        throw new BadRequestException('specificDate must not be set for recurring availability slots');
      }
    } else {
      if (!specificDate) {
        throw new BadRequestException('specificDate is required for non-recurring availability slots');
      }
      if (dayOfWeek !== null && dayOfWeek !== undefined) {
        throw new BadRequestException('dayOfWeek must not be set for non-recurring availability slots');
      }
    }
  }

  private mapToResponse(availability: Availability): AvailabilityResponseDto {
    return {
      id: availability.id,
      tutorId: availability.tutorId,
      dayOfWeek: availability.dayOfWeek ?? null,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isRecurring: availability.isRecurring,
      specificDate: availability.specificDate
        ? availability.specificDate instanceof Date
          ? availability.specificDate.toISOString().split('T')[0]
          : String(availability.specificDate)
        : null,
      effectiveFrom: availability.effectiveFrom
        ? availability.effectiveFrom instanceof Date
          ? availability.effectiveFrom.toISOString().split('T')[0]
          : String(availability.effectiveFrom)
        : null,
      effectiveUntil: availability.effectiveUntil
        ? availability.effectiveUntil instanceof Date
          ? availability.effectiveUntil.toISOString().split('T')[0]
          : String(availability.effectiveUntil)
        : null,
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt,
    };
  }
}
