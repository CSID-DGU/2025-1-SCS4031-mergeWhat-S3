// src/store-product/store_product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from './store_product.entity';
import { StoreProductService } from './store_product.service';
import { StoreProductController } from './store_product.controller';
import { Store } from '../store/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct, Store])],
  controllers: [StoreProductController],
  providers: [StoreProductService],
})
export class StoreProductModule {}
