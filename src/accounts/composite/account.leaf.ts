import { AccountComponent } from './account.component';
import { Account, AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountStateFactory } from '../state/account.state.factory';

export class AccountLeaf implements AccountComponent {
  constructor(private account: Account) {}

  getBalance(): Decimal {
    return this.account.balance;
  }

  close(): Map<string, AccountStatus> {
    const state = AccountStateFactory.from(this.account.status);
    const next = state.close(this.account.balance);
    return new Map([[this.account.id, next]]);
  }

  changeStatus(status: AccountStatus): Map<string, AccountStatus> {
    const state = AccountStateFactory.from(this.account.status);
    const next = state.changeStatus(status);
    return new Map([[this.account.id, next]]);
  }
}
