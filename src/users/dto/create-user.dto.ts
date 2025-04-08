/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', required: true })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'john@email.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'xxxx', required: true })
  @IsString()
  password?: string;

  @IsString()
  role: string;
}
