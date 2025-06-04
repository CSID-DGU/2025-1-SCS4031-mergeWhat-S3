import { Controller, Get, Param, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { BusinessHourService } from '../business_hour/bh.service';
import { StoreProductService } from 'src/store_product/store_product.service';
import { StoreKeywordService } from 'src/store_keyword/store_keyword.service';

@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly businessHourService: BusinessHourService,
    private readonly productService: StoreProductService,
  ) {}

  @Get('all')
  findAllStores() {
    return this.storeService.findAllStores();
  }

  @Get('search')
  findByCategoryAndMarket(
    @Query('category') category: string,
    @Query('marketName') marketName: string,
  ) {
    return this.storeService.findByCategoryAndMarket(category, marketName);
  }

  @Get(':id/business-hour')
  getBusinessHour(@Param('id') storeId: number) {
    return this.businessHourService.getByStoreId(Number(storeId));
  }

  @Get(':id/products')
  getProductsByStore(@Param('id') storeId: number) {
    return this.productService.getProductsByStoreId(Number(storeId));
  }
}
