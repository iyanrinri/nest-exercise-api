/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'john@email.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'xxxx', required: true })
  @IsString()
  password: string;
}
