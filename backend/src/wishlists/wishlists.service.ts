import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createWishlistDto: CreateWishlistDto) {
    const wishes = await this.wishesService.find(createWishlistDto.itemsId);

    return this.wishlistRepository.save({
      owner: user,
      items: wishes,
      ...createWishlistDto,
    });
  }

  findAll() {
    return this.wishlistRepository.find({ relations: ['owner', 'items'] });
  }

  findOne(id: number) {
    return this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new BadRequestException('Такого списка не существует');
    }

    if (!!updateWishlistDto.itemsId.length) {
      return this.wishlistRepository.update(id, {
        items: await this.wishesService.find(updateWishlistDto.itemsId),
        ...updateWishlistDto,
      });
    }

    await this.wishlistRepository.update(id, updateWishlistDto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const wishlist = await this.findOne(id);

    if (!wishlist) {
      throw new BadRequestException('Такого списка не существует');
    }

    return this.wishlistRepository.delete(id);
  }
}
