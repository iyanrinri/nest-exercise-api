import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import {
  ApiBody,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('merchants')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @ApiBody({ type: CreateMerchantDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Success message.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Roles('USER')
  create(@Body() createDto: CreateMerchantDto, @Req() request: Request) {
    const reqUser = request.user ? request.user : null;
    if (!reqUser) {
      return { message: 'Unauthorized' };
    }
    if (reqUser.role == 'ADMIN') {
      const body = request.body as { user_id: string | number };
      createDto.user_id = parseInt(String(body.user_id));
    } else {
      createDto.user_id = parseInt(String(reqUser.sub));
    }
    console.log(createDto);
    return this.merchantsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({ status: 200, description: 'Success message.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'paginated', required: false, type: Number })
  @ApiBearerAuth()
  async findAll(@Req() request: Request): Promise<any> {
    return this.merchantsService.paginateResultsByRequest(request);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: number, @Req() request: Request) {
    const reqUser = request.user ? request.user : null;
    if (!reqUser) {
      return { message: 'Unauthorized' };
    }
    return this.merchantsService.findOne(+id, reqUser);
  }

  @Put(':id')
  @ApiBody({ type: UpdateMerchantDto })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMerchantDto,
    @Req() request: Request,
  ) {
    const reqUser = request.user ? request.user : null;
    if (!reqUser) {
      return { message: 'Unauthorized' };
    }
    return this.merchantsService.update(+id, updateDto, reqUser);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() request: Request) {
    const reqUser = request.user ? request.user : null;
    if (!reqUser) {
      return { message: 'Unauthorized' };
    }
    return this.merchantsService.remove(+id, reqUser);
  }
}
