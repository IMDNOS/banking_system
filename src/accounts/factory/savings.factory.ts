import { AccountCreator } from './account.factory';
import { AccountCategory } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';

export class SavingsAccountFactory implements AccountCreator {
  create(dto: CreateAccountDto) {
    return {
      category: AccountCategory.SAVINGS,
      balance: dto.initialBalance ?? 0,
      interestRate: dto.interestRate,
      owner: { connect: { id: dto.ownerId } },
      parentAccount: {
        connect: { account_number:dto.parent_account_number },
      },
    };
  }
}
