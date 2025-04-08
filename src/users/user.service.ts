/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsNull, Repository, Brackets } from 'typeorm';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly users: User[] = [];
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.password) {
      const saltRounds = 10;
      createUserDto.password = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );
    }
    const userData: Partial<User> = {
      ...createUserDto,
      role: 'USER',
    };
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async findAll() {
    const users = await this.userRepository.find();
    users.forEach((user) => {
      this.users.push(user);
    });
    return this.users;
  }

  findOne(id: number) {
    let qb = this.userRepository.createQueryBuilder('user');
    qb = qb.where({
      id: id,
      deleted_at: IsNull(),
    });
    return qb.getOne();
  }

  findOneByEmail(email: string) {
    let qb = this.userRepository.createQueryBuilder('user');
    qb = qb.where({
      email: email,
      deleted_at: IsNull(),
    });
    return qb.getOne();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.deleted_at = new Date();
    const updatedUser = await this.userRepository.save(user);
    return {
      message: 'User deleted successfully',
    };
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

    qb = qb.where('user.deleted_at IS NULL');
    qb = qb.skip(skip).take(take).orderBy('user.created_at', 'DESC');
    // console.log(qb.getSql());
    const [data, total] = await qb.getManyAndCount();
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
