import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
//import { User } from '../user/user.entity';
import { Store } from '../store/store.entity';
import { User } from 'src/auth/member.entity';

@Entity('store_review')
export class StoreReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  store_id: number;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Optional relation mappings
  /*@ManyToOne(() => User, user => user.reviews)
  user: User;*/

  @ManyToOne(() => Store, (store) => store.reviews)
  @JoinColumn({ name: 'store_id' }) // ✅ 정확히 명시해줌
  store: Store;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
