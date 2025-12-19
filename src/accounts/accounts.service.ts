import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SavingsAccountFactory } from './factory/savings.factory';
import { CheckingAccountFactory } from './factory/checking.factory';
import { LoanAccountFactory } from './factory/loan.factory';
import { InvestmentAccountFactory } from './factory/investment.factory';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountStatus, UserRole } from '@prisma/client';
import { AccountStateFactory } from './state/account.state.factory';
import { AccountCompositeFactory } from './composite/account-composite.factory';

@Injectable()
export class AccountsService {
  private factories = {
    SAVINGS: new SavingsAccountFactory(),
    CHECKING: new CheckingAccountFactory(),
    LOAN: new LoanAccountFactory(),
    INVESTMENT: new InvestmentAccountFactory(),
  };

  constructor(private db: PrismaService) {}

  async createAccount(dto: CreateAccountDto) {
    const factory = this.factories[dto.category];
    if (!factory) throw new BadRequestException('Invalid account type');

    const owner = await this.db.user.findUnique({ where: { id: dto.ownerId } });
    if (!owner) {
      throw new BadRequestException('Account does not exist');
    }

    if (dto.parent_account_number) {
      const parentAccount = await this.db.account.findUnique({
        where: { account_number: dto.parent_account_number },
        select: { id: true },
      });
      if (!parentAccount)
        throw new BadRequestException('Account does not exist');
      dto.parentAccountId = parentAccount.id;
    }

    return this.db.account.create({
      data: factory.create(dto),
    });
  }

  async getAccountsForUser(user: { id: string; role: UserRole }) {
    switch (user.role) {
      case UserRole.CUSTOMER:
        return this.db.account.findMany({
          where: { ownerId: user.id },
        });
      case UserRole.TELLER:
      case UserRole.MANAGER:
        return this.db.account.findMany({
          where: { owner: { role: UserRole.CUSTOMER } },
        });
      case UserRole.ADMIN:
        return this.db.account.findMany();
      default:
        return [];
    }
  }

  // async updateAccount(
  //   accountId: string,
  //   dto: UpdateAccountDto,
  //   user: { id: string; role: UserRole },
  // ) {
  //   const account = await this.db.account.findUnique({
  //     where: { id: accountId },
  //   });
  //   if (!account) throw new NotFoundException();
  //
  //   if (user.role === UserRole.CUSTOMER && account.ownerId !== user.id) {
  //     throw new ForbiddenException();
  //   }
  //
  //   const state = AccountStateFactory.from(account.status);
  //   const newBalance = state.updateBalance(new Decimal(dto.balance));
  //
  //   return this.db.account.update({
  //     where: { id: accountId },
  //     data: { balance: newBalance },
  //   });
  // }

  async closeAccount(accountId: string, user: { id: string; role: UserRole }) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException();

    if (user.role === UserRole.CUSTOMER && account.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    const state = AccountStateFactory.from(account.status);
    const newStatus = state.close(account.balance);

    return this.db.account.update({
      where: { id: accountId },
      data: { status: newStatus },
    });
  }

  async changeAccountStatus(accountId: string, newStatus: AccountStatus) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException();

    const state = AccountStateFactory.from(account.status);
    const next = state.changeStatus(newStatus);

    return this.db.account.update({
      where: { id: accountId },
      data: { status: next },
    });
  }

  async getAggregatedBalance(accountId: string) {
    const component = await AccountCompositeFactory.build(this.db, accountId);
    return {
      accountId,
      balance: component.getBalance(),
    };
  }

  async closeAccountHierarchy(accountId: string) {
    const root = await this.db.account.findUnique({
      where: { id: accountId },
    });
    if (!root) throw new NotFoundException();

    const component = await AccountCompositeFactory.build(this.db, accountId);
    const updates = component.close();

    // return updates

    return this.db.$transaction(
      Array.from(updates.entries()).map(([id, status]) =>
        this.db.account.update({
          where: { id },
          data: { status },
        }),
      ),
    );
  }

  async freezeHierarchy(accountId: string) {
    const component = await AccountCompositeFactory.build(this.db, accountId);
    const updates = component.changeStatus(AccountStatus.FROZEN);

    return this.db.$transaction(
      Array.from(updates.entries()).map(([id, status]) =>
        this.db.account.update({
          where: { id },
          data: { status },
        }),
      ),
    );
  }
}
