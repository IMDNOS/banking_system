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
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountStatus, UserRole } from '@prisma/client';
import { InvestmentAccountFactory } from './factory/investment.factory';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountStateFactory } from './state/account.state.factory';
import { Decimal } from '@prisma/client/runtime/library';

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

    return this.db.account.create({
      data: factory.create(dto),
    });
  }

  // 🔐 VISIBILITY RULES LIVE HERE
  async getAccountsForUser(user: { id: string; role: UserRole }) {
    switch (user.role) {
      case UserRole.CUSTOMER:
        // 👤 Customers see ONLY their own accounts
        return this.db.account.findMany({
          where: { ownerId: user.id },
        });

      case UserRole.TELLER:
        return this.db.account.findMany({
          where: {
            owner: {
              role: UserRole.CUSTOMER,
            },
          },
        });
      case UserRole.MANAGER:
        // 🧑‍💼 Staff see customer accounts only
        return this.db.account.findMany({
          where: {
            owner: {
              role: UserRole.CUSTOMER,
            },
          },
        });

      case UserRole.ADMIN:
        //  Admin sees everything
        return this.db.account.findMany();

      default:
        return [];
    }
  }

  async updateAccount(
    accountId: string,
    dto: UpdateAccountDto,
    user: { id: string; role: UserRole },
  ) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException();

    // 🔒 STATE RULE
    const status = AccountStateFactory.from(account.status);

    // 🔐 OWNERSHIP RULE
    if (user.role === UserRole.CUSTOMER && account.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    return this.db.account.update({
      where: { id: accountId },
      data: { balance: status.updateBalance(new Decimal(dto.balance)) },
    });
  }

  async closeAccount(accountId: string, user: { id: string; role: UserRole }) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException();

    const status = AccountStateFactory.from(account.status);

    // if (account.status !== AccountStatus.ACTIVE) {
    //   throw new BadRequestException('Account is not active');
    // }
    //
    // if (+account.balance !== 0) {
    //   throw new BadRequestException('Balance must be zero');
    // }

    if (user.role === UserRole.CUSTOMER && account.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    return this.db.account.update({
      where: { id: accountId },
      data: { status: status.close(account.balance) },
    });
  }

  async changeAccountStatus(accountId: string, newStatus: AccountStatus) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException();

    // if (account.status === AccountStatus.CLOSED) {
    //   throw new BadRequestException('Closed accounts are immutable');
    // }
    const state=AccountStateFactory.from(account.status);


    return this.db.account.update({
      where: { id: accountId },
      data: { status: state.changeStatus(newStatus) },
    });
  }
}
