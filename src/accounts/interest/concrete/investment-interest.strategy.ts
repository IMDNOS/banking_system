// accounts/interest/investment-interest.strategy.ts
import { InterestStrategy, InterestContext } from '../interest.strategy';
import { Decimal } from '@prisma/client/runtime/library';

export class InvestmentInterestStrategy implements InterestStrategy {
  calculate({ balance, expectedReturn  }: InterestContext): Decimal {
    const rate = expectedReturn?.div(12);
    if (!rate) return balance;
    return balance.mul(rate);
  }
}
