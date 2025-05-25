import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { BusinessHourService } from 'src/business_hour/bh.service';
import { BusinessHour } from 'src/business_hour/bh.entity';
import { StoreProduct } from 'src/store_product/store_product.entity';
import { StoreProductService } from 'src/store_product/store_product.service';
import { StoreReview } from 'src/store_review/store_review.entity';
import { StoreReviewService } from 'src/store_review/store_review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, BusinessHour, StoreProduct, StoreReview]),
  ],
  providers: [
    StoreService,
    BusinessHourService,
    StoreProductService,
    StoreReviewService,
  ],
  controllers: [StoreController],
  exports: [StoreService], // 다른 모듈에서 사용할 경우
})
export class StoreModule {}
