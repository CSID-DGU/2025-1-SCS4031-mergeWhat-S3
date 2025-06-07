import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/auth/member.entity'; // 실제 User entity 경로에 맞게 수정
import { PostImage } from 'src/post_image/post_image.entity';
import { Comment } from 'src/comment/comment.entity';

export type BoardType = 'produce' | 'course' | 'food' | 'fashion' | 'etc';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' }) // FK 연결
  user: User;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({
    type: 'enum',
    enum: ['produce', 'course', 'food', 'fashion', 'etc'],
  })
  board_type: BoardType;

  @OneToMany(() => PostImage, (image) => image.post, { cascade: true })
  images: PostImage[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments: Comment[];
}
