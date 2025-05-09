import { Market } from 'src/market/market.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('store')
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contact: string;

  @Column({ type: 'boolean', default: false })
  is_affiliate: boolean;

  @Column('float', { nullable: true })
  center_lat: number;

  @Column('float', { nullable: true })
  center_lng: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  /*@CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;*/

  @Column({ nullable: true }) // null값허용 - 프론트에서 기본 이미지 제공
  image: string;

  @ManyToOne(() => Market, (market) => market.stores, { eager: true })
  @JoinColumn({ name: 'market_id' }) // 실제 DB 컬럼명과 매칭
  market: Market;
}
