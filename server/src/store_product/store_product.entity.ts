// src/store-product/store_product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../store/store.entity';

@Entity('store_product')
export class StoreProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_id: number;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  price: string; // 문자열 가격 (예: '10,000원')
}
