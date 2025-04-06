import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    const name = request.query.name;
    const nameStr =
      typeof name === 'string'
        ? name
        : Array.isArray(name)
          ? name.map(String).join(', ')
          : '';
    return 'This action returns all cats: ' + nameStr;
  }
}
