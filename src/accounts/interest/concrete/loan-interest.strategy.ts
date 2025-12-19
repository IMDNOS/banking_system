// accounts/interest/loan-interest.strategy.ts
import { InterestStrategy, InterestContext } from '../interest.strategy';
import { Decimal } from '@prisma/client/runtime/library';

export class LoanInterestStrategy implements InterestStrategy {
  calculate({
    balance,
    baseRate,
    accountRate,
    riskPremium = 0,
  }: InterestContext): Decimal {
    const apr = accountRate.add(baseRate).add(riskPremium);
    const rate = apr.div(12);

    return balance.mul(rate);
  }
}
