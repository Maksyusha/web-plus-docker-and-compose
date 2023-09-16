import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { Repository, In } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(user: User, createWishDto: CreateWishDto) {
    await this.wishRepository.save({ ...createWishDto, owner: user });

    return {};
  }

  getLast() {
    return this.wishRepository.find({
      take: 40,
      order: { createdAt: 'DESC' },
      relations: ['owner', 'offers'],
    });
  }

  async getTop() {
    return await this.wishRepository.find({
      take: 10,
      order: {copied: 'DESC'},
      relations: ['owner', 'offers']
    });
  }

  async findOne(id: number) {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: ['owner', 'offers'],
    });

    return wish;
  }

  async update(userId: number, wishId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать чужой подарок');
    }

    if (wish.raised !== 0) {
      throw new ForbiddenException(
        'Нельзя редактировать подарок, на который уже скинулись',
      );
    }

    await this.wishRepository.update(wishId, updateWishDto);

    return {};
  }

  async remove(userId: number, wishId: number) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалить чужой подарок');
    }

    await this.wishRepository.delete(wishId);

    return wish;
  }

  async copy(user: User, wishId: number) {
    const wish = await this.findOne(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скопировать свой подарок');
    }

    const { id, createdAt, updatedAt, ...result } = wish;

    const copy = { ...result, raised: 0, offers: [], copied: 0 };

    await this.create(user, copy);

    await this.wishRepository.update(wishId, { copied: wish.copied + 1 });

    return {};
  }

  async raise(wishId: number, raised: number) {
    await this.wishRepository.update(wishId, { raised });
  }

  async find(wishesId: number[]) {
    return await this.wishRepository.find({ where: { id: In(wishesId) } });
  }
}
