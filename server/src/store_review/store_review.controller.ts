import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { StoreReviewService } from './store_review.service';
import { StoreReview } from './store_review.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('reviews')
export class StoreReviewController {
  constructor(private readonly reviewService: StoreReviewService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // 저장 폴더
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      store_id: string;
      rating: string;
      comment: string;
    },
  ): Promise<StoreReview> {
    return this.reviewService.createReview({
      store_id: Number(body.store_id),
      rating: Number(body.rating),
      comment: body.comment,
      image: file ? `/reviews/${file.filename}` : null,
      user_id: 1, // TODO: 로그인 기반으로 실제 유저 ID 받도록 수정
    });
  }

  @Get('store/:store_id')
  async getByStore(@Param('store_id') store_id: number): Promise<any[]> {
    return this.reviewService.findReviewsWithUserNickname(Number(store_id));
  }
}
