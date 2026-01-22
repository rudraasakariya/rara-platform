import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Partner } from '../database/entities/partner.entity';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnerResponseDto } from './dto/partner-response.dto';
import { SearchPartnersQueryDto } from './dto/search-partners-query.dto';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<PartnerResponseDto> {
    const partner = this.partnerRepository.create({
      ...createPartnerDto,
      active: createPartnerDto.active ?? true,
    });
    const savedPartner = await this.partnerRepository.save(partner);
    return plainToInstance(PartnerResponseDto, savedPartner, {
      excludeExtraneousValues: true,
    });
  }

  async getPartnerById(id: string): Promise<PartnerResponseDto> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(Messages[MessageCode.PARTNER_NOT_FOUND]);
    }
    return plainToInstance(PartnerResponseDto, partner, {
      excludeExtraneousValues: true,
    });
  }

  async getPartners(query?: SearchPartnersQueryDto): Promise<PartnerResponseDto[]> {
    const queryBuilder = this.partnerRepository.createQueryBuilder('partner');

    if (query?.active !== undefined) {
      queryBuilder.andWhere('partner.active = :active', { active: query.active });
    }

    if (query?.type) {
      queryBuilder.andWhere('partner.type = :type', { type: query.type });
    }

    const partners = await queryBuilder.getMany();
    return partners.map(partner =>
      plainToInstance(PartnerResponseDto, partner, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async updatePartner(id: string, updatePartnerDto: UpdatePartnerDto): Promise<PartnerResponseDto> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(Messages[MessageCode.PARTNER_NOT_FOUND]);
    }

    await this.partnerRepository.update(id, updatePartnerDto);
    const updatedPartner = await this.partnerRepository.findOne({ where: { id } });
    return plainToInstance(PartnerResponseDto, updatedPartner, {
      excludeExtraneousValues: true,
    });
  }

  async deletePartner(id: string): Promise<void> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(Messages[MessageCode.PARTNER_NOT_FOUND]);
    }

    // Hard delete with CASCADE on partnerships (handled by database foreign key constraint)
    await this.partnerRepository.delete(id);
  }
}
