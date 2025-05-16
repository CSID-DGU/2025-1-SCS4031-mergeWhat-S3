// src/business-hour/bh.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessHour } from './bh.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BusinessHourService {
  b; //usinessHourRepository: any;
  constructor(
    @InjectRepository(BusinessHour)
    private bhRepository: Repository<BusinessHour>,
  ) {}

  async create(data: Partial<BusinessHour>): Promise<BusinessHour> {
    const bh = this.bhRepository.create(data);
    return this.bhRepository.save(bh);
  }

  async findByStoreId(storeId: number): Promise<BusinessHour[]> {
    return this.bhRepository.find({ where: { store_id: storeId } });
  }

  async update(id: number, data: Partial<BusinessHour>): Promise<BusinessHour> {
    await this.bhRepository.update(id, data);
    return this.bhRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    await this.bhRepository.delete(id);
  }

  async getByStoreId(storeId: number): Promise<BusinessHour[]> {
    return this.bhRepository.find({
      where: { store: { id: storeId } },
      order: { day: 'ASC' }, // ENUM 순서대로 정렬
      relations: ['store'], // store join 포함 (store_id 사용 가능하게)
    });
  }
}
