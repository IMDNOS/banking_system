import { AccountState } from './account.state';
import { AccountStatus } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

export class SuspendedState implements AccountState {
  updateBalance(): Decimal {
    throw new ConflictException(
      'Cannot update balance of suspended account',
    );
  }

  close(balance: Decimal): AccountStatus {
    if (balance.gt(0)) {
      throw new ConflictException(
        'Cannot close account with balance',
      );
    }
    return AccountStatus.CLOSED;
  }

  changeStatus(newStatus: AccountStatus): AccountStatus {
    return newStatus;
  }
}
