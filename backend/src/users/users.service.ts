import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HashService } from 'src/hash/hash.service';
import { FindManyDto } from './dto/find-many.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    return user;
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOneBy({ username });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    return user;
  }

  async find(findManyDto: FindManyDto) {
    const users = await this.userRepository.find({
      where: [{ username: findManyDto.query }, { email: findManyDto.query }],
    });

    if (!users) {
      throw new NotFoundException('Такого/таких пользователя нет');
    }

    return users;
  }

  async getWishes(username: string) {
    const { wishes } = await this.userRepository.findOne({
      where: { username },
      relations: ['wishes', 'wishes.offers', 'wishes.owner'],
    });

    return wishes;
  }

  async create(createUserDto: CreateUserDto) {
    const foundedUser = await this.findByUsername(createUserDto.username);

    if (foundedUser) {
      throw new BadRequestException('Такой пользователь уже есть');
    }

    createUserDto.password = this.hashService.hash(createUserDto.password);

    const user = await this.userRepository.save(createUserDto);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findById(id);

    if (updateUserDto.email && user.email !== updateUserDto.email) {
      const userWithSuchEmail = await this.findByEmail(updateUserDto.email);

      if (userWithSuchEmail) {
        throw new BadRequestException('Такой email уже есть');
      }
    }

    if (updateUserDto.username && user.username !== updateUserDto.username) {
      const userWithSuchUsername = await this.findByUsername(
        updateUserDto.username,
      );

      if (userWithSuchUsername) {
        throw new BadRequestException('Такое имя уже занято');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = this.hashService.hash(updateUserDto.password);
    }

    await this.userRepository.update(id, { avatar: updateUserDto.avatar });

    return this.findById(id);
  }
}
