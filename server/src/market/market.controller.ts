import { Controller, Get, Query } from '@nestjs/common';
import { MarketService } from './market.service';

// api 전달

@Controller('markets/search')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get()
  async searchMarkets(@Query('query') query: string) {
    return this.marketService.searchByName(query);
  }
}
