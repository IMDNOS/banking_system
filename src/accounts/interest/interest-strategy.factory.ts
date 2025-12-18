// accounts/interest/interest-strategy.factory.ts
import { AccountCategory } from '@prisma/client';
import { InterestStrategy } from './interest.strategy';
import { SavingsInterestStrategy } from './savings-interest.strategy';
import { CheckingInterestStrategy } from './checking-interest.strategy';
import { LoanInterestStrategy } from './loan-interest.strategy';
import { InvestmentInterestStrategy } from './investment-interest.strategy';

export class InterestStrategyFactory {
  static get(category: AccountCategory): InterestStrategy {
    switch (category) {
      case AccountCategory.SAVINGS:
        return new SavingsInterestStrategy();
      case AccountCategory.CHECKING:
        return new CheckingInterestStrategy();
      case AccountCategory.LOAN:
        return new LoanInterestStrategy();
      case AccountCategory.INVESTMENT:
        return new InvestmentInterestStrategy();
      default:
        throw new Error('Unsupported account category');
    }
  }
}
