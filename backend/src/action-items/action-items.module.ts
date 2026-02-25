import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionItem } from '../database/entities/action-item.entity';
import { ActionItemsService } from './action-items.service';
import { ActionItemsController } from './action-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActionItem])],
  controllers: [ActionItemsController],
  providers: [ActionItemsService],
  exports: [ActionItemsService],
})
export class ActionItemsModule {}
