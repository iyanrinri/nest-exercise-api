/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John Doe', required: true })
  @IsOptional()
  @IsString()
  name?: string;
}
