import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Post } from 'src/post/post.entity';
import { User } from 'src/auth/member.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  post_id: number;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
