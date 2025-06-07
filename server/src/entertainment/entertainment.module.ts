// src/entertainment/entertainment.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entertainment } from './entertainment.entity';
import { EntertainmentService } from './entertainment.service';
import { EntertainmentController } from './entertainment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Entertainment])],
  controllers: [EntertainmentController],
  providers: [EntertainmentService],
  exports: [EntertainmentService],
})
export class EntertainmentModule {}
