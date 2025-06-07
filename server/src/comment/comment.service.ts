import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = this.commentRepository.create(commentData);
    return this.commentRepository.save(comment);
  }

  async findByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post_id: postId },
      relations: ['user'], // 프론트 요청에 맞춰 user 정보 포함
      order: { created_at: 'DESC' },
    });
  }
}
