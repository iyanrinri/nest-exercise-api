import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-here', required: true })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewPassword123!', required: true })
  @IsString()
  @Length(8, 30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, number/special character',
  })
  password: string;

  @ApiProperty({ example: 'NewPassword123!', required: true })
  @IsString()
  password_confirmation: string;
}
