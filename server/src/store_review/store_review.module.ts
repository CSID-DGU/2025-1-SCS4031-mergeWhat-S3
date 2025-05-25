import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreReview } from './store_review.entity';
import { StoreReviewService } from './store_review.service';
import { StoreReviewController } from './store_review.controller';
import { Store } from 'src/store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreReview, Store])],
  providers: [StoreReviewService],
  controllers: [StoreReviewController],
})
export class StoreReviewModule {}
