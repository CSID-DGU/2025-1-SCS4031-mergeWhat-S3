// src/store-keyword/store_keyword.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreKeyword } from './store_keyword.entity';

@Injectable()
export class StoreKeywordService {
  constructor(
    @InjectRepository(StoreKeyword)
    private storeKeywordRepository: Repository<StoreKeyword>,
  ) {}

  async findKeywordsByStoreId(storeId: number): Promise<StoreKeyword[]> {
    // 특정 store_id에 해당하는 키워드들을 frequency(빈도수) 내림차순으로 정렬하여 가져옵니다.
    // 필요에 따라 상위 N개만 가져오도록 limit을 추가할 수 있습니다.
    return this.storeKeywordRepository.find({
      where: { store_id: storeId },
      order: { frequency: 'DESC' }, // 빈도수가 높은 순으로 정렬
    });
  }

  // 키워드를 추가하거나 빈도수를 업데이트하는 등의 로직은 여기에 추가할 수 있습니다.
  // 예를 들어, 새로운 리뷰가 작성되었을 때 키워드를 추출하고 저장하는 로직
  // async createKeyword(keywordData: {store_id: number; keyword: string; frequency?: number}): Promise<StoreKeyword> {
  //   const newKeyword = this.storeKeywordRepository.create(keywordData);
  //   return this.storeKeywordRepository.save(newKeyword);
  // }
}
