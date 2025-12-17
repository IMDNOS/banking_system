import { AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface AccountState {
  // updateBalance(balance: Decimal): Decimal;
  close(balance: Decimal): AccountStatus;
  changeStatus(newStatus: AccountStatus): AccountStatus;
  deposit(balance: Decimal, amount: Decimal): Decimal;
  withdraw(balance: Decimal, amount: Decimal): Decimal;
}
