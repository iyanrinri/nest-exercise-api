/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository, Brackets } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async paginateResultsByRequest(request: Request) {
    const query = request.query;
    const searchQuery = (query.query as string | undefined)?.toString() || '';
    const take = Math.max(Number(query.perPage) || 10, 1);
    const page = Math.max(Number(query.page) || 1, 1);
    const skip = (page - 1) * take;

    let qb = this.userRepository.createQueryBuilder('user');

    if (searchQuery) {
      qb = qb.andWhere(
        new Brackets((qb1) => {
          qb1
            .where('user.name LIKE :search', { search: `%${searchQuery}%` })
            .orWhere('user.email LIKE :search', { search: `%${searchQuery}%` });
        }),
      );
    }

    qb = qb.skip(skip).take(take).orderBy('user.created_at', 'DESC');
    console.log(qb.getSql());
    const [data, total] = await qb.getManyAndCount();
    return {
      data,
      total,
      page: Math.floor(skip / take) + 1,
      lastPage: Math.ceil(total / take),
    };
  }
}
