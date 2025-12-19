import { Decimal } from '@prisma/client/runtime/library';

export interface InterestContext {
  balance: Decimal;

  baseRate: number;
  accountRate: Decimal;
  riskPremium?: number;
  expectedReturn?: Decimal;
}
export interface InterestStrategy {
  calculate(context: InterestContext): Decimal;
}
