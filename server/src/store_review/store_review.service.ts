import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreReview } from './store_review.entity';
import { Store } from 'src/store/store.entity';

@Injectable()
export class StoreReviewService {
  constructor(
    @InjectRepository(StoreReview)
    private reviewRepository: Repository<StoreReview>,

    @InjectRepository(Store)
    private storeRepo: Repository<Store>,
  ) {}

  async createReview(body: any): Promise<StoreReview> {
    const { store_id, rating, comment } = body;

    const store = await this.storeRepo.findOne({
      where: { id: store_id },
    });

    if (!store) {
      throw new Error('❌ 해당 store_id에 대한 가게가 존재하지 않습니다.');
    }

    const newReview = this.reviewRepository.create({
      rating,
      comment,
      store,
      image: null, // multipart 이미지 업로드 처리가 필요하면 이 부분 확장
      user_id: 3, // !!!! 임의로 정해놓은 테스트 코드이므로 향후 무조건 수정 필요 !!!!
    });

    return this.reviewRepository.save(newReview);
  }

  async findReviewsByStore(store_id: number): Promise<StoreReview[]> {
    return this.reviewRepository.find({
      where: { store_id },
      order: { created_at: 'DESC' },
    });
  }

  async findReviewsWithUserNickname(store_id: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.user', 'user')
      .select([
        'review.id',
        'review.rating',
        'review.comment',
        'review.created_at',
        'user.nickname',
      ])
      .where('review.store_id = :store_id', { store_id })
      .orderBy('review.created_at', 'DESC')
      .getRawMany(); // { review_id, review_rating, ..., user_nickname }
  }
}
