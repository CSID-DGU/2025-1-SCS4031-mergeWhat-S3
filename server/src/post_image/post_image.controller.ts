import { Controller, Get, Param } from '@nestjs/common';
import { PostImageService } from './post_image.service';

@Controller('post-images')
export class PostImageController {
  constructor(private readonly postImageService: PostImageService) {}

  // 특정 게시물에 연결된 이미지 목록을 가져옴
  @Get(':postId')
  async findImagesByPostId(@Param('postId') postId: number) {
    return this.postImageService.findByPostId(postId);
  }
}
