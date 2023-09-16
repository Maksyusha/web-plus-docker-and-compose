import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Length, MaxLength, IsUrl } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Base } from 'src/common/entities/base.entity';

@Entity()
export class Wishlist extends Base {
  @Column()
  @Length(1, 250)
  name: string;

  @Column({
    nullable: true,
  })
  @MaxLength(1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
