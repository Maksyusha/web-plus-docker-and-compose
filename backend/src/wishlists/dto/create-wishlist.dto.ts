import {
  Length,
  IsUrl,
  MaxLength,
  IsArray,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[] | null[];

  @MaxLength(1500)
  description?: string;
}
