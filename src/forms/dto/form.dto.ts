import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class FormDto {
  @Type(() => Number)
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}