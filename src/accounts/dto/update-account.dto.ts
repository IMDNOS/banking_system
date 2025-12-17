import { IsNumber } from 'class-validator';

export class UpdateAccountDto {
  @IsNumber()
  balance: number;
}
