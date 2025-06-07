// src/entertainment/entertainment.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Market } from 'src/market/market.entity';

@Entity()
export class Entertainment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  market_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'boolean' })
  is_indoor: boolean;

  @Column({ length: 255 })
  image_url: string;

  // (선택) ManyToOne으로 market 연결 가능
  @ManyToOne(() => Market, (market) => market.entertainments, {
    onDelete: 'CASCADE',
  })
  market: Market;
}
