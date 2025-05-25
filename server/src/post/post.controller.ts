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

  // 게시판 타입별 조회
  @Get('by-type')
  getByType(@Query('type') type: string): Promise<PostEntity[]> {
    return this.postService.findByBoardType(type);
  }

  // 단일 게시글 조회
  @Get(':id')
  getById(@Param('id') id: number): Promise<PostEntity> {
    return this.postService.findOne(id);
  }

  // 게시글 등록
  @HttpPost()
  createPost(@Body() body: Partial<PostEntity>): Promise<PostEntity> {
    return this.postService.create(body);
  }
}
