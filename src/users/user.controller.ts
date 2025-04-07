import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
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
      },
    };
  }
}
