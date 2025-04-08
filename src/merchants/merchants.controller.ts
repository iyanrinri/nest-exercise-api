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
@Roles('ADMIN')
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  @Post()
  @ApiBody({ type: CreateMerchantDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Success message.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() createDto: CreateMerchantDto) {
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
  findOne(@Param('id') id: number) {
    return this.merchantsService.findOne(+id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateMerchantDto })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateDto: UpdateMerchantDto) {
    return this.merchantsService.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.merchantsService.remove(+id);
  }
}
