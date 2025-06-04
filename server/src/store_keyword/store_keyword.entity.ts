// src/store-keyword/store_keyword.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../store/store.entity'; // Store 엔티티 경로에 따라 수정하세요

@Entity('store_keyword')
export class StoreKeyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'store_id' }) // 컬럼명 일치
  store_id: number;

  @Column()
  keyword: string;

  @Column({ default: 1 })
  frequency: number; // 키워드 옆에 쓰여질 갯수

  // Store 엔티티와의 관계 정의 (선택 사항이지만, 관계형 DB의 이점을 살리는 것이 좋습니다)
  @ManyToOne(() => Store, (store) => store.keywords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;
}
