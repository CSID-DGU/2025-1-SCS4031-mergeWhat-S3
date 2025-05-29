import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('post_image')
export class PostImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'postImage_url', type: 'varchar', length: 255, select: true })
  postImageUrl: string;

  @Column()
  post_id: number;

  @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;
}
