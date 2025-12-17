import { AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface AccountState {
  updateBalance(balance: Decimal): Decimal;
  close(balance: Decimal): AccountStatus;
  changeStatus(newStatus: AccountStatus): AccountStatus;
}
