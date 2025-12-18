// accounts/interest/interest.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { InterestStrategyFactory } from './interest-strategy.factory';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class InterestService {
  constructor(private readonly db: PrismaService) {}

  async calculateInterest(accountId: string, baseRate: number) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const strategy = InterestStrategyFactory.get(account.category);

    /**
     * Realistic assumptions:
     * - baseRate → market / central bank rate (APR)
     * - accountRate → product-specific spread
     * - riskPremium → loan-only adjustment
     */
    return strategy.calculate({
      balance: new Decimal(account.balance),
      baseRate,
      accountRate: account.interestRate, // stored per account/product
      riskPremium: account.category === 'LOAN' ? 0.02 : 0, // example
      expectedReturn: account.expectedReturn ? account.expectedReturn : undefined
        // account.category === 'INVESTMENT'
        //   ? account.expectedReturn
        //   : undefined,
    });
  }

  async applyInterest(accountId: string, baseRate: number) {
    const interest = await this.calculateInterest(accountId, baseRate);

    return this.db.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: interest,
        },
      },
    });
  }
}
