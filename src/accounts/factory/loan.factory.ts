import { AccountCreator } from './account.factory';
import { AccountCategory } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';

export class LoanAccountFactory implements AccountCreator {
  create(dto: CreateAccountDto) {
    return {
      account_number: crypto.randomUUID(),
      category: AccountCategory.LOAN,
      balance: -Math.abs(dto.initialBalance ?? 0),
      interestRate: dto.interestRate,
      owner: { connect: { id: dto.ownerId } },
    };
  }
}
