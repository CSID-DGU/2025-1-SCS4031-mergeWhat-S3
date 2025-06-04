// src/store-keyword/store_keyword.controller.ts

import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { StoreKeywordService } from './store_keyword.service';
import { StoreKeyword } from './store_keyword.entity';

@Controller('store-keywords') // API 경로: /store-keywords
export class StoreKeywordController {
  constructor(private readonly storeKeywordService: StoreKeywordService) {}

  @Get(':storeId') // GET /store-keywords/:storeId
  async getKeywordsByStoreId(
    @Param('storeId', ParseIntPipe) storeId: number,
  ): Promise<StoreKeyword[]> {
    return this.storeKeywordService.findKeywordsByStoreId(storeId);
  }
}
