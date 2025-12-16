import { AccountState } from './account.state';
import { AccountStatus } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

export class ActiveState implements AccountState {
  updateBalance(balance: Decimal) {
    return balance;
  }
  close(balance: Decimal) {
    if (balance.gt(0)) {
      throw new ConflictException('Cannot close account with balance');
    }
    return AccountStatus.CLOSED;
  }

  changeStatus(newStatus: AccountStatus): AccountStatus {
    return newStatus;
  }
}
