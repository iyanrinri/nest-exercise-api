/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PartialType } from '@nestjs/swagger';
import { CreateMerchantDto } from './create-merchant.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateMerchantDto extends PartialType(CreateMerchantDto) {
  @ApiProperty({ example: 'Merchant 1', required: true })
  @IsString()
  @Length(1, 100)
  name: string;
}
