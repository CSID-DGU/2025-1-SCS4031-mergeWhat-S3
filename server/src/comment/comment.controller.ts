import { Controller, Post as HttpPost, Body, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // ✅ 댓글 작성 (POST /comments)
  @HttpPost()
  async createComment(
    @Body() body: { post_id: number; user_id: number; content: string },
  ): Promise<Comment> {
    return this.commentService.create({
      post_id: body.post_id,
      user_id: body.user_id,
      content: body.content,
    });
  }

  // ✅ 특정 게시글의 댓글 조회 (GET /comments/post/:postId)
  @Get('post/:postId')
  async getCommentsByPostId(
    @Param('postId') postId: number,
  ): Promise<Comment[]> {
    return this.commentService.findByPostId(postId);
  }
}
