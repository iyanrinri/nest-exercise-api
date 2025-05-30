import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { SignInDto } from './dto/sign-in';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../common/decorators/public.decorator';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private readonly emailService: EmailService,
  ) {}

  @Public()
  @Post('forgot-password')
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.password,
      resetPasswordDto.password_confirmation,
    );
  }

  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.email,
      registerDto.name,
      registerDto.password,
      registerDto.password_confirmation,
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    // this.logger.log(`Sign in request: ${JSON.stringify(signInDto)}`);
    // const data = {
    //   name: 'Moamad Nurdiansyah',
    //   subject: 'testing email',
    //   message: 'this is a test email',
    // };
    // void this.emailService
    //   .sendEmail('mohamad.nurdiansyah@mediawave.co.id', 'Test', '', data)
    //   .then((info) => {
    //     console.log(info);
    //   });
    return this.authService.signIn(signInDto.email, signInDto.password, signInDto.remember);
  }
}
