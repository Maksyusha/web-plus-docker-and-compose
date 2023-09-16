import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import {
  Min,
  Max,
  IsUrl,
  IsNumber,
  IsDecimal,
  IsPositive,
} from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Base } from 'src/common/entities/base.entity';

@Entity()
export class Wish extends Base {
  @Column()
  @Min(1)
  @Max(250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Column({ default: 0 })
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  raised: number;

  @Column()
  @Min(1)
  @Max(1024)
  description: string;

  @Column({ default: 0 })
  @IsDecimal()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
