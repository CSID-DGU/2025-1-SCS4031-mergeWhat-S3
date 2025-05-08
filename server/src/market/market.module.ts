import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './market.entity';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  providers: [MarketService],
  controllers: [MarketController],
  exports: [MarketService], // 다른 모듈에서도 사용할 경우
})
export class MarketModule {}
