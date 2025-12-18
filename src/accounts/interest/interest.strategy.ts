// accounts/interest/interest.strategy.ts
import { Decimal } from '@prisma/client/runtime/library';
import { AccountCategory } from '@prisma/client';

export interface InterestContext {
  balance: Decimal;

  // annual rates (APR)
  baseRate: number;        // e.g. central bank / bank base rate
  accountRate: Decimal;     // product-specific spread

  // loan-specific
  riskPremium?: number;    // added for loans

  // investment-specific
  expectedReturn?: Decimal; // expected annual return (can be negative)

}
export interface InterestStrategy {
  calculate(context: InterestContext): Decimal;
}
