import {
  Length,
  MinLength,
  MaxLength,
  IsUrl,
  IsEmail,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(4)
  password: string;

  @Length(2, 30)
  username: string;

  @ValidateIf((o) => o.avatar !== '')
  @IsUrl()
  @MaxLength(200)
  avatar?: string;

  @ValidateIf((o) => o.about !== '')
  @IsString()
  @Length(2, 200)
  about?: string;
}
