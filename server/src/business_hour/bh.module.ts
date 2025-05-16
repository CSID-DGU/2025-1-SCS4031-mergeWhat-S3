// src/business-hour/bh.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessHour } from './bh.entity';
import { BusinessHourService } from './bh.service';
import { BusinessHourController } from './bh.controller';
import { Store } from '../store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessHour, Store])],
  controllers: [BusinessHourController],
  providers: [BusinessHourService],
})
export class BusinessHourModule {}
