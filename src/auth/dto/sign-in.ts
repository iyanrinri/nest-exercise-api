/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail } from 'class-validator';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'john@email.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'xxxx', required: true })
  @IsString()
  password: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  remember: boolean;
}
