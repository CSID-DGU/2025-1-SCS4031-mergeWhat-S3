import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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

  /*@CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;*/

  @Column({ nullable: true }) // null값허용 - 프론트에서 기본 이미지 제공
  image: string;
}
