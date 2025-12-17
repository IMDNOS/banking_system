import { AccountStatus } from '@prisma/client';
import { AccountState } from './account.state';
import { ActiveState } from './active.state';
import { ClosedState } from './closed.state';
import { FrozenState } from './frozen.state';
import { SuspendedState } from './suspended.state';

export class AccountStateFactory {
  static from(status: AccountStatus): AccountState {
    switch (status) {
      case AccountStatus.ACTIVE:
        return new ActiveState();
      case AccountStatus.FROZEN:
        return new FrozenState();
      case AccountStatus.SUSPENDED:
        return new SuspendedState();
      case AccountStatus.CLOSED:
        return new ClosedState();
      default:
        throw new Error('Unknown state');
    }
  }
}
