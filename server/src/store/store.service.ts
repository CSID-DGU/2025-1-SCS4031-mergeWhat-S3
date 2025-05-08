import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepo: Repository<Store>,
  ) {}

  async searchByNameOrCategory(query?: string): Promise<Store[]> {
    if (query) {
      // query가 있을 경우 이름 또는 카테고리로 검색
      return this.storeRepo.find({
        where: [{ name: Like(`%${query}%`) }, { category: Like(`%${query}%`) }],
        select: [
          'id',
          'name',
          'category',
          'address',
          'contact',
          'image',
          'center_lat',
          'center_lng',
          'is_affiliate',
        ],
      });
    }

    // query가 없으면 전체 리스트 반환
    return this.storeRepo.find({
      select: [
        'id',
        'name',
        'category',
        'address',
        'contact',
        'image',
        'center_lat',
        'center_lng',
        'is_affiliate',
      ],
    });
  }
}
