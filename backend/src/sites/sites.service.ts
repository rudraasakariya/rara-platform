import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Site } from '../database/entities/site.entity';
import { Student } from '../database/entities/student.entity';
import { Session } from '../database/entities/session.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';
import { SiteResponseDto } from './dto/site-response.dto';
import { SearchSitesQueryDto } from './dto/search-sites-query.dto';
import { MessageCode, Messages } from '../common/messages';

@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async createSite(createSiteDto: CreateSiteDto): Promise<SiteResponseDto> {
    const site = this.siteRepository.create({
      ...createSiteDto,
      active: createSiteDto.active ?? true,
    });
    const savedSite = await this.siteRepository.save(site);
    return plainToInstance(SiteResponseDto, savedSite, {
      excludeExtraneousValues: true,
    });
  }

  async getSiteById(id: string): Promise<SiteResponseDto> {
    const site = await this.siteRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException(Messages[MessageCode.SITE_NOT_FOUND]);
    }
    return plainToInstance(SiteResponseDto, site, {
      excludeExtraneousValues: true,
    });
  }

  async getSites(query?: SearchSitesQueryDto): Promise<SiteResponseDto[]> {
    const queryBuilder = this.siteRepository.createQueryBuilder('site');

    if (query?.active !== undefined) {
      queryBuilder.andWhere('site.active = :active', { active: query.active });
    }

    if (query?.city) {
      queryBuilder.andWhere('site.city = :city', { city: query.city });
    }

    if (query?.state) {
      queryBuilder.andWhere('site.state = :state', { state: query.state });
    }

    const sites = await queryBuilder.getMany();
    return sites.map(site =>
      plainToInstance(SiteResponseDto, site, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async updateSite(id: string, updateSiteDto: UpdateSiteDto): Promise<SiteResponseDto> {
    const site = await this.siteRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException(Messages[MessageCode.SITE_NOT_FOUND]);
    }

    await this.siteRepository.update(id, updateSiteDto);
    const updatedSite = await this.siteRepository.findOne({ where: { id } });
    return plainToInstance(SiteResponseDto, updatedSite, {
      excludeExtraneousValues: true,
    });
  }

  async deleteSite(id: string): Promise<void> {
    const site = await this.siteRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException(Messages[MessageCode.SITE_NOT_FOUND]);
    }

    // Check if site has associated students
    const studentCount = await this.studentRepository.count({
      where: { siteId: id },
    });

    // Check if site has associated sessions
    const sessionCount = await this.sessionRepository.count({
      where: { siteId: id },
    });

    if (studentCount > 0 || sessionCount > 0) {
      throw new BadRequestException(Messages[MessageCode.SITE_CANNOT_BE_DELETED]);
    }

    await this.siteRepository.delete(id);
  }
}
