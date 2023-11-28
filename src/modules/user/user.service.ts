import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { generateHash } from 'src/common/utils';
import { USER_CONSTANTS } from 'src/constants/user.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.findByEmail(createUserDto.email);

    if (isExist)
      throw new ConflictException(USER_CONSTANTS.EMAIL_ALREADY_TAKEN);

    const { password } = createUserDto;
    createUserDto.password = generateHash(password);
    return this.userRepository.save(createUserDto);
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

    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    const isExist = await this.findById(id);
    if (!isExist) throw new NotFoundException(USER_CONSTANTS.USER_NOT_FOUND);

    return await this.userRepository.delete(id);
  }
}
