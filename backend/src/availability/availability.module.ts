import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { Availability } from '../database/entities/availability.entity';
import { Tutor } from '../database/entities/tutor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Availability, Tutor])],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
