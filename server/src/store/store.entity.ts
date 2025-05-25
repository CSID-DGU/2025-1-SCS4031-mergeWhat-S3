import { BusinessHour } from 'src/business_hour/bh.entity';
import { Market } from 'src/market/market.entity';
import { StoreProduct } from 'src/store_product/store_product.entity';
import { StoreReview } from 'src/store_review/store_review.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  indoor_name: string;

  /*@CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;*/

  @Column({ nullable: true }) // null값허용 - 프론트에서 기본 이미지 제공
  image: string;

  @ManyToOne(() => Market, (market) => market.stores, { eager: true })
  @JoinColumn({ name: 'market_id' }) // 여기서 market_id는 store테이블에 있는 컬럼명.
  // market테이블의 id, 즉 market.id 와 조인시키는 것. 명칭 헷갈리지 말기!
  market: Market;

  @OneToMany(() => BusinessHour, (bh) => bh.store)
  businessHours: BusinessHour[];

  @OneToMany(() => StoreProduct, (product) => product.store)
  products: StoreProduct[];

  @OneToMany(() => StoreReview, (review) => review.store)
  reviews: StoreReview[];
}
