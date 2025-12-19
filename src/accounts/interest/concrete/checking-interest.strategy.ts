// accounts/interest/checking-interest.strategy.ts
import { InterestStrategy, InterestContext } from '../interest.strategy';
import { Decimal } from '@prisma/client/runtime/library';

  export class CheckingInterestStrategy implements InterestStrategy {
  calculate({ balance, accountRate }: InterestContext): Decimal {
    const rate = accountRate.div(12); // e.g. 0.001 / 12
    return balance.mul(rate);
  }
}

