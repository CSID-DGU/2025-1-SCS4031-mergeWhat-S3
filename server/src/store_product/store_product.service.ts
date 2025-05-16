// src/store-product/store_product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StoreProduct } from './store_product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(StoreProduct)
    private productRepo: Repository<StoreProduct>,
  ) {}

  async create(data: Partial<StoreProduct>): Promise<StoreProduct> {
    const product = this.productRepo.create(data);
    return this.productRepo.save(product);
  }

  async findByStoreId(storeId: number): Promise<StoreProduct[]> {
    return this.productRepo.find({ where: { store_id: storeId } });
  }

  async update(id: number, data: Partial<StoreProduct>): Promise<StoreProduct> {
    await this.productRepo.update(id, data);
    return this.productRepo.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.productRepo.delete(id);
  }

  async getProductsByStoreId(
    storeId: number,
  ): Promise<{ name: string; price: string }[]> {
    return this.productRepo.find({
      where: { store_id: storeId },
      select: ['name', 'price'],
    });
  }
}
