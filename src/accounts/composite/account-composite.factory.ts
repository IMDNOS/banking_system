import { PrismaService } from '../../prisma.service';
import { AccountComponent } from './account.component';
import { AccountComposite } from './account.composite';
import { AccountLeaf } from './account.leaf';

export class AccountCompositeFactory {
  static async build(
    db: PrismaService,
    accountId: string,
  ): Promise<AccountComponent> {
    const account = await db.account.findUnique({
      where: { id: accountId },
      include: { subAccounts: true },
    });

    if (!account) throw new Error('Account not found');

    if (account.subAccounts.length) {
      return new AccountComposite(account, account.subAccounts);
    }

    return new AccountLeaf(account);
  }
}
