import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

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
}
