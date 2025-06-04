import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostImage } from './post_image.entity';
import { Post } from 'src/post/post.entity';

@Injectable()
export class PostImageService {
  constructor(
    @InjectRepository(PostImage)
    private readonly postImageRepository: Repository<PostImage>,
  ) {}

  async findByPostId(postId: number): Promise<PostImage[]> {
    return this.postImageRepository.find({
      where: { post: { id: postId } }, // post_id ❌ → post.id ✅
      select: ['id', 'postImage_url', 'post_id'],
    });
  }

  async create(post: Post, imageUrl: string): Promise<PostImage> {
    const newImage = this.postImageRepository.create({
      post, // 관계 객체
      postImage_url: imageUrl, // 필드 이름 정확히 일치
    });
    return this.postImageRepository.save(newImage);
  }

  async deleteByPostId(postId: number): Promise<void> {
    await this.postImageRepository.delete({ post_id: postId });
  }
}
