import { AccountComponent } from './account.component';
import { Account, AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { AccountLeaf } from './account.leaf';
import { AccountStateFactory } from '../state/account.state.factory';

export class AccountComposite implements AccountComponent {
  private children: AccountComponent[];

  constructor(
    private account: Account,
    subAccounts: Account[],
  ) {
    this.children = subAccounts.map(acc => new AccountLeaf(acc));
  }

  getBalance(): Decimal {
    return this.children.reduce(
      (sum, c) => sum.add(c.getBalance()),
      new Decimal(0),
    );
  }

  close(): Map<string, AccountStatus> {
    const updates = new Map<string, AccountStatus>();

    const state = AccountStateFactory.from(this.account.status);
    updates.set(this.account.id, state.close(this.account.balance));

    for (const child of this.children) {
      child.close().forEach((v, k) => updates.set(k, v));
    }

    return updates;
  }

  changeStatus(status: AccountStatus): Map<string, AccountStatus> {
    const updates = new Map<string, AccountStatus>();

    const state = AccountStateFactory.from(this.account.status);
    updates.set(this.account.id, state.changeStatus(status));

    for (const child of this.children) {
      child.changeStatus(status).forEach((v, k) => updates.set(k, v));
    }

    return updates;
  }
}
