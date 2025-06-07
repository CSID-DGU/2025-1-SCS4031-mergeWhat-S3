import { Entertainment } from 'src/entertainment/entertainment.entity';
import { Store } from 'src/store/store.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('market')
export class Market extends BaseEntity {
  [x: string]: any;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('float')
  center_lat: number;

  @Column('float')
  center_lng: number;

  @Column('json')
  polygon: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Store, (store) => store.market)
  stores: Store[];

  @OneToMany(() => Entertainment, (entertainment) => entertainment.market, {
    cascade: true,
  })
  entertainments: Entertainment[];
}
