import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', required: true })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'john@email.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', required: true })
  @IsString()
  @Length(8, 30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({ example: 'Password123!', required: true })
  @IsString()
  password_confirmation: string;
}
