// src/entertainment/entertainment.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Entertainment } from './entertainment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EntertainmentService {
  constructor(
    @InjectRepository(Entertainment)
    private readonly entertainmentRepo: Repository<Entertainment>,
  ) {}

  async findImageUrl(
    marketId: number,
    placeName: string,
    isIndoor: boolean,
  ): Promise<string | null> {
    const result = await this.entertainmentRepo.findOne({
      where: {
        market_id: marketId,
        name: placeName,
        is_indoor: isIndoor,
      },
    });
    console.log('🔍 이미지 검색 조건:', { marketId, placeName, isIndoor });
    return result?.image_url ?? null;
  }
}
