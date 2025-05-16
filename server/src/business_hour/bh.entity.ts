// src/business-hour/bh.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../store/store.entity';

@Entity('business_hour')
export class BusinessHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_id: number;

  @ManyToOne(() => Store, (store) => store.businessHours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({
    type: 'enum',
    enum: [
      '월요일',
      '화요일',
      '수요일',
      '목요일',
      '금요일',
      '토요일',
      '일요일',
    ],
  })
  day: string;

  @Column({ type: 'time', nullable: true })
  open_time: string;

  @Column({ type: 'time', nullable: true })
  close_time: string;

  @Column()
  is_closed: boolean;
}
