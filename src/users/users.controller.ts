import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('users')
@ApiTags('Users')
@Roles('ADMIN')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({ status: 200, description: 'Success message.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'perPage', required: false, type: Number })
  @ApiQuery({ name: 'paginated', required: false, type: Number })
  @ApiBearerAuth()
  async findAll(@Req() request: Request): Promise<any> {
    return this.userService.paginateResultsByRequest(request);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
