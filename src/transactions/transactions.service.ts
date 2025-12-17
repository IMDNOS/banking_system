import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionStatus, TransactionType, UserRole } from '@prisma/client';
import { AccountStateFactory } from '../accounts/state/account.state.factory';
import { ApprovalChainFactory } from './approval/approval-chain.factory';

@Injectable()
export class TransactionsService {
  constructor(private db: PrismaService) {}

  // =========================
  // DEPOSIT
  // =========================
  async deposit(
    accountId: string,
    amount: number,
  ) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException();

    const state = AccountStateFactory.from(account.status);
    const newBalance = state.deposit(account.balance, new Decimal(amount));

    return this.db.$transaction([
      this.db.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      }),
      this.db.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount: new Decimal(amount),
          status: TransactionStatus.APPROVED,
          toAccountId: accountId,
        },
      }),
    ]);
  }

  // =========================
  // WITHDRAW
  // =========================
  async withdraw(
    accountId: string,
    amount: number,
  ) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException();


    if (account.balance.lt(amount)) {
      throw new BadRequestException('Insufficient funds');
    }

    const state = AccountStateFactory.from(account.status);
    const newBalance = state.withdraw(account.balance, new Decimal(amount));

    return this.db.$transaction([
      this.db.account.update({
        where: { id: accountId },
        data: { balance: newBalance },
      }),
      this.db.transaction.create({
        data: {
          type: TransactionType.WITHDRAW,
          amount: new Decimal(amount),
          status: TransactionStatus.APPROVED,
          fromAccountId: accountId,
        },
      }),
    ]);
  }

  // =========================
  // TRANSFER
  // =========================
  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
  ) {
    const decimalAmount = new Decimal(amount);

    const approvalChain = ApprovalChainFactory.create();
    const status = approvalChain.handle({
      amount: decimalAmount,
    });

    // 🚦 If approval is required -> save and STOP
    if (status !== TransactionStatus.APPROVED) {
      return this.db.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: decimalAmount,
          status,
          fromAccountId,
          toAccountId,
        },
      });
    }

    // =========================
    // EXECUTION (only if COMPLETED)
    // =========================

    const [from, to] = await Promise.all([
      this.db.account.findUnique({ where: { id: fromAccountId } }),
      this.db.account.findUnique({ where: { id: toAccountId } }),
    ]);

    if (!from || !to) throw new NotFoundException();

    const fromState = AccountStateFactory.from(from.status);
    const toState = AccountStateFactory.from(to.status);

    const newFromBalance = fromState.withdraw(from.balance, decimalAmount);
    const newToBalance = toState.deposit(to.balance, decimalAmount);

    return this.db.$transaction([
      this.db.account.update({
        where: { id: fromAccountId },
        data: { balance: newFromBalance },
      }),
      this.db.account.update({
        where: { id: toAccountId },
        data: { balance: newToBalance },
      }),
      this.db.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: decimalAmount,
          status: TransactionStatus.APPROVED,
          fromAccountId,
          toAccountId,
        },
      }),
    ]);
  }

  // =========================
  // HISTORY
  // =========================
  async getAccountTransactions(accountId: string, user: any) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException();

    if (user.role === UserRole.CUSTOMER && account.ownerId !== user.id) {
      throw new ForbiddenException();
    }

    return this.db.transaction.findMany({
      where: {
        OR: [{ fromAccountId: accountId }, { toAccountId: accountId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingTransactions(user: { role: UserRole }) {
    if (user.role !== UserRole.MANAGER && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException();
    }
    return this.db.transaction.findMany({
      where: {
        status:
          user.role === UserRole.ADMIN
            ? {
                in: [
                  TransactionStatus.REQUIRES_ADMIN,
                  TransactionStatus.REQUIRES_MANAGER,
                ],
              }
            : TransactionStatus.REQUIRES_MANAGER,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async reviewTransaction(
    transactionId: string,
    decision: TransactionStatus,
    user: { id: string; role: UserRole },
  ) {
    const tx = await this.db.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) throw new NotFoundException();

    // 🔐 Role enforcement
    if (
      tx.status === TransactionStatus.REQUIRES_MANAGER &&
      user.role !== UserRole.MANAGER &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException();
    }

    if (
      tx.status === TransactionStatus.REQUIRES_ADMIN &&
      user.role !== UserRole.ADMIN
    ) {
      throw new ForbiddenException();
    }

    // =========================
    // Rejection
    // =========================
    if (decision === TransactionStatus.REJECTED) {
      return this.db.transaction.update({
        where: { id: transactionId },
        data: { status: TransactionStatus.REJECTED },
      });
    }

    // =========================
    // APPROVAL = EXECUTION
    // =========================

    if (tx.type !== TransactionType.TRANSFER) {
      throw new BadRequestException('Only transfers require approval');
    }

    const [from, to] = await Promise.all([
      this.db.account.findUnique({ where: { id: tx.fromAccountId! } }),
      this.db.account.findUnique({ where: { id: tx.toAccountId! } }),
    ]);

    if (!from || !to) throw new NotFoundException();

    const amount = tx.amount;

    const fromState = AccountStateFactory.from(from.status);
    const toState = AccountStateFactory.from(to.status);

    const newFromBalance = fromState.withdraw(from.balance, amount);
    const newToBalance = toState.deposit(to.balance, amount);

    return this.db.$transaction([
      this.db.account.update({
        where: { id: from.id },
        data: { balance: newFromBalance },
      }),
      this.db.account.update({
        where: { id: to.id },
        data: { balance: newToBalance },
      }),
      this.db.transaction.update({
        where: { id: transactionId },
        data: {
          status: TransactionStatus.APPROVED,
        },
      }),
    ]);
  }
}
