/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNumber } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ example: 'Merchant 1', required: true })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  user_id: number;
}
