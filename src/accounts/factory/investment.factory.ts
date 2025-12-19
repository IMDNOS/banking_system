import { AccountCreator } from './account.factory';
import { AccountCategory } from '@prisma/client';
import { CreateAccountDto } from '../dto/create-account.dto';
import { BadRequestException } from '@nestjs/common';

export class InvestmentAccountFactory implements AccountCreator {
  create(dto: CreateAccountDto) {
    if (!dto.expectedReturn) {
      throw new BadRequestException('expectedReturn should not be empty');
    }

    return {
      category: AccountCategory.INVESTMENT,
      balance: dto.initialBalance ?? 0,
      interestRate: dto.interestRate,
      expectedReturn: dto.expectedReturn,
      owner: {
        connect: { id: dto.ownerId },
      },
      parentAccount: dto.parent_account_number
        ? { connect: { account_number: dto.parent_account_number } }
        : undefined,
    };
  }
}
