import { AccountCreator } from './account.factory';
import { AccountCategory } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';

export class InvestmentAccountFactory implements AccountCreator {
  create(dto: CreateAccountDto) {
    return {
      account_number: crypto.randomUUID(),
      category: AccountCategory.INVESTMENT,
      balance: dto.initialBalance ?? 0,
      owner: {
        connect: { id: dto.ownerId },
      },
    };
  }
}
