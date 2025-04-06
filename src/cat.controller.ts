import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@Controller('cats')
@ApiTags('Cats')
export class CatsController {
  @Get()
  @ApiOperation({ summary: 'Get cat with name' })
  @ApiResponse({ status: 200, description: 'Success message.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'name', required: false, type: String })
  findAll(@Req() request: Request, @Query('name') name: string) {
    return { message: 'This action returns all cats: ' + name };
  }
}
