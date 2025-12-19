import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { AccountCategory } from '@prisma/client';

export class CreateAccountDto {
  @IsUUID()
  ownerId: string;

  @IsEnum(AccountCategory)
  category: AccountCategory;

  @IsOptional()
  @IsNumber()
  initialBalance?: number;

  @IsNotEmpty()
  @IsNumber()
  interestRate: number;

  @IsOptional()
  @IsNumber()
  expectedReturn?:number

  @IsOptional()
  @IsNumber()
  parent_account_number?:number
}
