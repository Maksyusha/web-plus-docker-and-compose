import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(user: User, createOfferDto: CreateOfferDto) {
    const wish = await this.wishesService.findOne(createOfferDto.itemId);

    if (!wish) {
      throw new NotFoundException('Подарок с таким id не найден');
    }

    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Вы не можете скинуться на свой подарок');
    }

    if (createOfferDto.amount <= 0) {
      throw new BadRequestException('Сумма должна быть больше нуля');
    }

    if (createOfferDto.amount + wish.raised > wish.price) {
      throw new BadRequestException(
        'Вы не можете скинуть больше, чем стоит подарок',
      );
    }

    await this.wishesService.raise(
      createOfferDto.itemId,
      wish.raised + createOfferDto.amount,
    );

    await this.offerRepository.save({ user, item: wish, ...createOfferDto });

    return {};
  }

  findAll() {
    return this.offerRepository.find({ relations: ['item', 'user'] });
  }

  findOne(id: number) {
    return this.offerRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }
}
