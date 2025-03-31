import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ZodPipe } from '@app/common';

import { CurrentUser } from '../current-user.decorator';
import { JwtAuthGuard } from '../guards';
import { CreateUserDto, CreateUserDtoSwagger } from './dto/create-user.dto';
import { User } from './entities';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserDtoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  createUser(@Body(new ZodPipe(CreateUserDto)) createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getUser(@CurrentUser() user: User) {
    const { id } = user;

    return this.usersService.getUser({ id });
  }
}
