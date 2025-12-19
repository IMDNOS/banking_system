import { AccountCreator } from './account.factory';
import { AccountCategory } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';

export class LoanAccountFactory implements AccountCreator {
  create(dto: CreateAccountDto) {
    return {
      category: AccountCategory.LOAN,
      balance: -Math.abs(dto.initialBalance ?? 0),
      interestRate: dto.interestRate,
      owner: { connect: { id: dto.ownerId } },
      parentAccount: dto.parent_account_number
        ? { connect: { account_number: dto.parent_account_number } }
        : undefined,
    };
  }
}
