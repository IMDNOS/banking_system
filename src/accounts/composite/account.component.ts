import { AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface AccountComponent {
  getBalance(): Decimal;
  close(): Map<string, AccountStatus>;
  changeStatus(status: AccountStatus): Map<string, AccountStatus>;
}
