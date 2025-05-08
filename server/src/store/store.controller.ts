import { Controller, Get, Query } from '@nestjs/common';
import { StoreService } from './store.service';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get('search')
  async searchStores(@Query('query') query?: string) {
    return this.storeService.searchByNameOrCategory(query);
  }
}
