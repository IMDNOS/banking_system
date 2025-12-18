import { AccountCategory } from '@prisma/client';
import { AccountCreator } from './account.factory';
import { CreateAccountDto } from '../dto/create-account.dto';

export class CheckingAccountFactory implements AccountCreator {
  create(dto: CreateAccountDto) {
    return {
      account_number: crypto.randomUUID(),
      category: AccountCategory.CHECKING,
      balance: dto.initialBalance ?? 0,
      interestRate: dto.interestRate,
      owner: { connect: { id: dto.ownerId } },
    };
  }
}
