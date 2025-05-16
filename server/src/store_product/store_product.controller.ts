// src/store-product/store_product.controller.ts
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { StoreProductService } from './store_product.service';
import { StoreProduct } from './store_product.entity';

@Controller('store-product')
export class StoreProductController {
  constructor(private readonly service: StoreProductService) {}

  @Post()
  create(@Body() data: Partial<StoreProduct>): Promise<StoreProduct> {
    return this.service.create(data);
  }

  @Get(':storeId')
  getByStoreId(@Param('storeId') storeId: number): Promise<StoreProduct[]> {
    return this.service.findByStoreId(storeId);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<StoreProduct>,
  ): Promise<StoreProduct> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.service.delete(id);
  }
}
