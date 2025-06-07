import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Post } from 'src/post/post.entity';
import { User } from 'src/auth/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Post, User])],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
