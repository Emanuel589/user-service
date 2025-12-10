import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ForcePasswordChangeGuard } from '../auth/guards/force-password-change.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      user: result.user,
      defaultPassword: result.defaultPassword,
      warning:
        'Save this password securely. The user must change it on first login.',
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, ForcePasswordChangeGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
