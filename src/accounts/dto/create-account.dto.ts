import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
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
}
