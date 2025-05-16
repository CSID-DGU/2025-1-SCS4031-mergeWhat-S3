// src/business-hour/bh.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BusinessHourService } from './bh.service';
import { BusinessHour } from './bh.entity';

@Controller('business-hour')
export class BusinessHourController {
  constructor(private readonly bhService: BusinessHourService) {}

  @Post()
  create(@Body() data: Partial<BusinessHour>): Promise<BusinessHour> {
    return this.bhService.create(data);
  }

  @Get(':storeId')
  getByStoreId(@Param('storeId') storeId: number): Promise<BusinessHour[]> {
    return this.bhService.findByStoreId(storeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<BusinessHour>,
  ): Promise<BusinessHour> {
    return this.bhService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.bhService.delete(id);
  }
}
