// accounts/interest/savings-interest.strategy.ts
import { InterestStrategy, InterestContext } from './interest.strategy';
import { Decimal } from '@prisma/client/runtime/library';

export class SavingsInterestStrategy implements InterestStrategy {
  calculate({ balance, baseRate, accountRate }: InterestContext): Decimal {
    const apr = accountRate.add(baseRate);
    const rate = apr.div(12);

    return balance.mul(rate);
  }
}
