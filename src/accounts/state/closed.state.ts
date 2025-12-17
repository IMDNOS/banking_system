import { AccountState } from './account.state';
import { AccountStatus } from '@prisma/client';
import { ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

export class ClosedState implements AccountState {
  updateBalance(): Decimal {
    throw new ConflictException('Closed account is immutable');
  }

  close(): AccountStatus {
    throw new ConflictException('Account already closed');
  }

  changeStatus(): AccountStatus {
    return AccountStatus.CLOSED;
  }

  deposit(): Decimal {
    throw new ConflictException('Closed account is immutable');
  }
  withdraw(): Decimal {
    throw new ConflictException('Closed account is immutable');
  }

}
