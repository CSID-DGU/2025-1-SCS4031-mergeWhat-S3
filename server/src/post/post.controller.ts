import {
  Controller,
  Get,
  Post as HttpPost,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostEntity } from './post.entity';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 전체 게시글 조회
  @Get()
  getAll(): Promise<PostEntity[]> {
    return this.postService.findAll();
  }

  @Get('by-category')
  async getPostsByCategory(
    @Query('category')
    category: 'course' | 'produce' | 'etc' | 'food' | 'fashion',
  ): Promise<PostEntity[]> {
    return this.postService.findByBoardType(category);
  }

  @HttpPost('write')
  createPostByWrite(
    @Body()
    body: {
      title: string;
      content: string;
      board_type: 'course' | 'produce' | 'food' | 'fashion' | 'etc';
    },
  ): Promise<PostEntity> {
    const userId = 3; // 실제 로그인 유저 ID로 교체 필요 (예: req.user.id)
    return this.postService.create({
      user_id: userId,
      title: body.title,
      content: body.content,
      board_type: body.board_type,
    });
  }
}
