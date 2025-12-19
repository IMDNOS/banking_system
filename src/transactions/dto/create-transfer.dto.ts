import { IsUUID, IsNumber, Min, IsNotEmpty } from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsNumber()
  toAccountNumber: number;

  @IsNumber()
  @Min(0.01)
  amount: number;
}
