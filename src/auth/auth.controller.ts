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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: SignInDto })
  signIn(@Body() signInDto: SignInDto) {
    // this.logger.log(`Sign in request: ${JSON.stringify(signInDto)}`);
    // void this.emailService
    //   .sendEmail(
    //     'mohamad.nurdiansyah@mediawave.co.id',
    //     'Test',
    //     '',
    //     '<b>wow amazing</b>',
    //   )
    //   .then((info) => {
    //     console.log(info);
    //   });
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
