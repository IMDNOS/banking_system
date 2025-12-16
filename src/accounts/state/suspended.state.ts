import { AccountState } from './account.state';
import { AccountStatus } from '@prisma/client';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

export class SuspendedState implements AccountState {
  updateBalance(): Decimal {
    throw new ConflictException('can not update balance of suspended account' );
  }
  close():AccountStatus {
    throw new BadRequestException('Account already closed');
  }

  changeStatus(newStatus: AccountStatus): AccountStatus {
    return newStatus;
  }
}
