import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateHash, validateHash } from 'src/common/utils';
import { USER_CONSTANTS } from 'src/constants/user.constants';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.findByEmail(createUserDto.email);

    if (isExist)
      throw new ConflictException(USER_CONSTANTS.EMAIL_ALREADY_TAKEN);

    const { password } = createUserDto;
    createUserDto.password = generateHash(password);
    return this.userRepository.save(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const isExist = await this.findByEmail(loginUserDto.email);

    if (!isExist)
      throw new UnauthorizedException(USER_CONSTANTS.INCORRECT_EMAIL);

    const validatePassword = await validateHash(
      loginUserDto.password,
      isExist.password,
    );

    if (!validatePassword)
      throw new UnauthorizedException(USER_CONSTANTS.PASSWORD_MISMATCH);

    const accessToken = await this.jwtService.signAsync({
      id: isExist.id,
      name: isExist.name,
      email: isExist.email,
    });
    return { jwtToken: accessToken, userData: isExist };
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findAll() {
    return this.userRepository.find();
  }

  findById(id: string) {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const isExist = await this.findById(id);
    if (!isExist) throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);

    if (updateUserDto.password)
      updateUserDto.password = generateHash(updateUserDto.password);

    return await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .returning('*') // PostgreSQL syntax to return the updated data
      .execute();
  }

  async remove(id: string) {
    const isExist = await this.findById(id);
    if (!isExist) throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);

    return await this.userRepository.delete(id);
  }
}
