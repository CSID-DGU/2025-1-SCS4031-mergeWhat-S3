// src/store-keyword/store_keyword.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreKeywordController } from './store_keyword.controller';
import { StoreKeywordService } from './store_keyword.service';
import { StoreKeyword } from './store_keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreKeyword])], // StoreKeyword 엔티티를 이 모듈에서 사용할 수 있도록 등록
  controllers: [StoreKeywordController], // 컨트롤러 등록
  providers: [StoreKeywordService], // 서비스 등록
  exports: [StoreKeywordService], // 다른 모듈에서 StoreKeywordService를 주입받아 사용할 수 있도록 export
})
export class StoreKeywordModule {}
