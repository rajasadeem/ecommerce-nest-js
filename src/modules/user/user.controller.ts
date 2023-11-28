import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_CONSTANTS } from 'src/constants/user.constants';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);

      return { message: USER_CONSTANTS.CREATED, data: user };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.login(loginUserDto);

      const { jwtToken, userData } = user;

      return {
        message: USER_CONSTANTS.LOGIN,
        data: { jwtToken, user: userData },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/')
  async findAll() {
    try {
      const users = await this.userService.findAll();

      if (!users) throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);

      return { message: USER_CONSTANTS.FOUND, data: users };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);

      if (!user) throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);

      return { message: USER_CONSTANTS.FOUND, data: user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userService.update(id, updateUserDto);
      return { message: USER_CONSTANTS.UPDATE, data: user.raw[0] };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
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
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
