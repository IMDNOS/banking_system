import { AccountState } from './account.state';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class ClosedState implements AccountState {
  updateBalance(): Decimal {
    throw new ConflictException('can not update balance of closed account' );
  }

  close(): AccountStatus {
    throw new BadRequestException('Account already closed');
  }

  changeStatus() {
    return AccountStatus.CLOSED;
  }
}
