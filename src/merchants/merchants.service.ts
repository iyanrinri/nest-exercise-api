import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { Merchant } from './entities/merchant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { IsNull, Repository, Brackets } from 'typeorm';

@Injectable()
export class MerchantsService {
  private readonly merchants: Merchant[] = [];
  constructor(
    @InjectRepository(Merchant)
    private readonly merchantRepository: Repository<Merchant>,
  ) {}

  async create(createDto: CreateMerchantDto) {
    const merchantData: Partial<Merchant> = createDto;
    const merchant = this.merchantRepository.create(merchantData);
    return await this.merchantRepository.save(merchant);
  }

  async findAll() {
    const merchants = await this.merchantRepository.find();
    merchants.forEach((merchant) => {
      this.merchants.push(merchant);
    });
    return this.merchants;
  }

  findOne(id: number) {
    let qb = this.merchantRepository.createQueryBuilder('merchants');
    qb = qb.where({
      id: id,
      deleted_at: IsNull(),
    });
    return qb.getOne();
  }

  async update(id: number, updateDto: UpdateMerchantDto) {
    const merchant = await this.findOne(id);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    Object.assign(merchant, updateDto);
    return await this.merchantRepository.save(merchant);
  }

  async remove(id: number) {
    const merchant = await this.findOne(id);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    merchant.deleted_at = new Date();
    await this.merchantRepository.save(merchant);
    return {
      message: 'Merchant deleted successfully',
    };
  }

  async paginateResultsByRequest(request: Request) {
    const query = request.query;
    const searchQuery = (query.query as string | undefined)?.toString() || '';
    const take = Math.max(Number(query.perPage) || 10, 1);
    const page = Math.max(Number(query.page) || 1, 1);
    const skip = (page - 1) * take;

    let qb = this.merchantRepository.createQueryBuilder('merchants');

    if (searchQuery) {
      qb = qb.andWhere(
        new Brackets((qb1) => {
          qb1.where('merchants.name LIKE :search', {
            search: `%${searchQuery}%`,
          });
        }),
      );
    }

    qb = qb.where('merchants.deleted_at IS NULL');
    qb = qb.skip(skip).take(take).orderBy('merchants.created_at', 'DESC');
    // console.log(qb.getSql());
    const [data, total] = await qb.getManyAndCount();
    // console.log(query.paginated);
    if (query.paginated != '1') {
      return data;
    }
    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      lastPage: Math.ceil(total / take),
    };
  }
}
