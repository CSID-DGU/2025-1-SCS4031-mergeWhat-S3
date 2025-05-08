import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Market } from './market.entity';

@Injectable()
export class MarketService {
  constructor(
    @InjectRepository(Market)
    private readonly marketRepo: Repository<Market>,
  ) {}

  async searchByName(query: string): Promise<Market[]> {
    const result = await this.marketRepo.find({
      select: ['id', 'name', 'center_lat', 'center_lng'], // 꼭 4개 컬럼 가져오기!
      where: { name: Like(`%${query}%`) },
    });

    console.log('서버에서 검색한 마켓 데이터:', result); // 콘솔로 결과 보기

    return result;
  }
}
