import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { Merchant } from './entities/merchant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { IsNull, Repository, Brackets } from 'typeorm';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import * as dayjs from 'dayjs';

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

  async findAll(reqUser: UserPayload) {
    let qb = this.merchantRepository.createQueryBuilder('merchants');
    qb = qb.leftJoinAndSelect('merchants.user', 'user');
    qb = qb.where({
      deleted_at: IsNull(),
    });
    if (reqUser.role == 'USER') {
      qb = qb.andWhere('merchants.user_id = :userId', {
        userId: reqUser.sub,
      });
    }
    const merchants = await qb.getMany();
    merchants.forEach((merchant) => {
      this.merchants.push(merchant);
    });
    return merchants.map((merchant) => ({
      ...merchant,
      created_at_human: merchant.created_at.toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    }));
  }

  findOne(id: number, reqUser: UserPayload) {
    let qb = this.merchantRepository.createQueryBuilder('merchants');
    qb = qb.where({
      id: id,
      deleted_at: IsNull(),
    });
    if (reqUser.role == 'USER') {
      qb = qb.andWhere('merchants.user_id = :userId', {
        userId: reqUser.sub,
      });
    }
    return qb.getOne();
  }

  async update(id: number, updateDto: UpdateMerchantDto, reqUser: UserPayload) {
    const merchant = await this.findOne(id, reqUser);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    if (merchant.user_id != reqUser.sub) {
      throw new NotFoundException('Merchant not found');
    }
    Object.assign(merchant, updateDto);
    return await this.merchantRepository.save(merchant);
  }

  async remove(id: number, reqUser: UserPayload) {
    const merchant = await this.findOne(id, reqUser);
    if (!merchant) {
      throw new NotFoundException('Merchant not found');
    }
    if (merchant.user_id != reqUser.sub) {
      throw new NotFoundException('Merchant not found');
    }
    merchant.deleted_at = new Date();
    await this.merchantRepository.save(merchant);
    return {
      message: 'Merchant deleted successfully',
    };
  }

  async paginateResultsByRequest(request: Request) {
    const reqUser = request.user ?? null;
    if (!reqUser) {
      throw new NotFoundException('Unauthorized');
    }

    const query = request.query;
    const searchQuery = (query.query as string | undefined)?.toString() || '';
    const take = Math.max(Number(query.perPage) || 10, 1);
    const page = Math.max(Number(query.page) || 1, 1);
    const skip = (page - 1) * take;

    let qb = this.merchantRepository
      .createQueryBuilder('merchants')
      .leftJoinAndSelect('merchants.user', 'user')
      .where('merchants.deleted_at IS NULL')
      .orderBy('merchants.created_at', 'DESC')
      .skip(skip)
      .take(take);

    if (searchQuery) {
      qb = qb.andWhere(
        new Brackets((qb1) => {
          qb1.where('merchants.name LIKE :search', {
            search: `%${searchQuery}%`,
          });
        }),
      );
    }

    if (reqUser.role === 'USER') {
      qb = qb.andWhere('merchants.user_id = :userId', {
        userId: reqUser.sub,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    const formattedData = data.map((merchant) => ({
      ...merchant,
      created_at_human: dayjs(merchant.created_at).format('DD MMM YYYY HH:mm'),
      user: merchant.user
        ? {
            id: merchant.user.id,
            name: merchant.user.name,
          }
        : null,
    }));

    if (query.paginated !== '1') {
      return formattedData;
    }

    return {
      data: formattedData,
      total,
      page,
      lastPage: Math.ceil(total / take),
    };
  }
}
