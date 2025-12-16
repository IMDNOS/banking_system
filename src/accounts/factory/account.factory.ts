import { Prisma } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';

export interface AccountCreator {
  create(dto: CreateAccountDto): Prisma.AccountCreateInput;
}
