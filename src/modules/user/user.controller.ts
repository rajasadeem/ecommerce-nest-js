import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_CONSTANTS } from 'src/constants/user.constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      return { message: USER_CONSTANTS.CREATED, data: user };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(USER_CONSTANTS.EMAIL_ALREADY_TAKEN);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.findAll();

      if (!users) throw new NotFoundException();

      return { message: USER_CONSTANTS.FOUND, data: users };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);

      if (!user) throw new NotFoundException();

      return { message: USER_CONSTANTS.FOUND, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return { message: USER_CONSTANTS.UPDATE, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    try {
      await this.userService.remove(id);

      return { message: USER_CONSTANTS.USER_DELETED };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
