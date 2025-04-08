import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VerifiedGuard } from 'src/auth/guards/verified.guard';

@Controller('user')
@ApiTags('User')
@UseGuards(VerifiedGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({ status: 200, description: 'Success message.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth()
  me(@Req() request: Request) {
    const reqUser = request.user ? request.user : null;
    if (!reqUser) {
      return { message: 'Unauthorized' };
    }
    return {
      data: {
        id: reqUser.sub,
        name: reqUser.email,
        role: reqUser?.role || 'USER',
        email_verified_at: reqUser?.email_verified_at || null,
      },
    };
  }
}
