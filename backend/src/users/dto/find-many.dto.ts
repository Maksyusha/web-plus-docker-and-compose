import { IsString } from 'class-validator';

export class FindManyDto {
  @IsString()
  query: string;
}
