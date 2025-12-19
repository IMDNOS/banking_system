import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionStatus, TransactionType, UserRole } from '@prisma/client';
import { AccountStateFactory } from '../accounts/state/account.state.factory';
import { ApprovalChainFactory } from './approval/approval-chain.factory';
import { PushNotification } from '../notifications/adapter/push-notification';

@Injectable()
export class TransactionsService {
  constructor(private db: PrismaService) {}

  // =========================
  // DEPOSIT
  // =========================
  async deposit(accountId: string, amount: number) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
      include: { owner: true },
    });
    if (!account) throw new BadRequestException('account not found');

    const state = AccountStateFactory.from(account.status);
    const newBalance = state.deposit(account.balance, new Decimal(amount));

    const [, tx] = await this.db.$transaction([
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

    PushNotification(
      {
        account_id: accountId,
        email: account.owner.email,
        phone_number: account.owner.phone_number,
        message: `Deposit of ${amount} was successful`,
        transaction_id: tx.id,
      },
      {
        email: account.owner.notifyByEmail,
        sms: account.owner.notifyBySMS,
        whatsapp: account.owner.notifyByWhatsapp,
      },
    );

    return tx;
  }

  // =========================
  // WITHDRAW
  // =========================
  async withdraw(accountId: string, amount: number) {
    const account = await this.db.account.findUnique({
      where: { id: accountId },
      include: { owner: true },
    });
    if (!account) throw new BadRequestException('account not found');

    if (account.balance.lt(amount)) {
      throw new BadRequestException('Insufficient funds');
    }

    const state = AccountStateFactory.from(account.status);
    const newBalance = state.withdraw(account.balance, new Decimal(amount));

    const [, tx] = await this.db.$transaction([
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

    PushNotification(
      {
        account_id: accountId,
        email: account.owner.email,
        phone_number: account.owner.phone_number,
        message: `Withdrawal of ${amount} was successful`,
        transaction_id: tx.id,
      },
      {
        email: account.owner.notifyByEmail,
        sms: account.owner.notifyBySMS,
        whatsapp: account.owner.notifyByWhatsapp,
      },
    );

    return tx;
  }

  // =========================
  // TRANSFER
  // =========================
  async transfer(
    fromAccountId: string,
    toAccountNumber: number,
    amount: number,
  ) {
    const decimalAmount = new Decimal(amount);

    // =========================
    // APPROVAL CHAIN
    // =========================
    const approvalChain = ApprovalChainFactory.create();
    const status = approvalChain.handle({ amount: decimalAmount });

    // =========================
    // FETCH ACCOUNTS + OWNERS
    // =========================
    const [fromAccount, toAccount] = await Promise.all([
      this.db.account.findUnique({
        where: { id: fromAccountId },
        include: { owner: true },
      }),
      this.db.account.findUnique({
        where: { account_number: toAccountNumber },
        include: { owner: true },
      }),
    ]);

    if (!fromAccount || !toAccount) {
      throw new BadRequestException('account number not found');
    }

    if (fromAccount.balance.lt(decimalAmount)) {
      throw new ConflictException('Insufficient funds');
    }

    // =========================
    // PENDING APPROVAL
    // =========================
    if (status !== TransactionStatus.APPROVED) {
      const tx = await this.db.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: decimalAmount,
          status,
          fromAccountId,
          toAccountId: toAccount.id,
        },
      });

      PushNotification(
        {
          account_id: fromAccountId,
          email: fromAccount.owner.email,
          phone_number: fromAccount.owner.phone_number,
          message: `Transfer of ${amount} is pending approval`,
          transaction_id: tx.id,
        },
        {
          email: fromAccount.owner.notifyByEmail,
          sms: fromAccount.owner.notifyBySMS,
          whatsapp: fromAccount.owner.notifyByWhatsapp,
        },
      );

      return tx;
    }

    // =========================
    // EXECUTION (APPROVED)
    // =========================
    const fromState = AccountStateFactory.from(fromAccount.status);
    const toState = AccountStateFactory.from(toAccount.status);

    const newFromBalance = fromState.withdraw(
      fromAccount.balance,
      decimalAmount,
    );
    const newToBalance = toState.deposit(toAccount.balance, decimalAmount);

    const [, , tx] = await this.db.$transaction([
      this.db.account.update({
        where: { id: fromAccountId },
        data: { balance: newFromBalance },
      }),
      this.db.account.update({
        where: { account_number: toAccountNumber },
        data: { balance: newToBalance },
      }),
      this.db.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: decimalAmount,
          status: TransactionStatus.APPROVED,
          fromAccountId,
          toAccountId: toAccount.id,
        },
      }),
    ]);

    // =========================
    // NOTIFY SENDER
    // =========================
    PushNotification(
      {
        account_id: fromAccountId,
        email: fromAccount.owner.email,
        phone_number: fromAccount.owner.phone_number,
        message: `You sent ${amount} to account ${toAccount.account_number}`,
        transaction_id: tx.id,
      },
      {
        email: fromAccount.owner.notifyByEmail,
        sms: fromAccount.owner.notifyBySMS,
        whatsapp: fromAccount.owner.notifyByWhatsapp,
      },
    );

    // =========================
    // NOTIFY RECEIVER
    // =========================
    PushNotification(
      {
        account_id: toAccount.id,
        email: toAccount.owner.email,
        phone_number: toAccount.owner.phone_number,
        message: `You received ${amount} from account ${fromAccount.account_number}`,
        transaction_id: tx.id,
      },
      {
        email: toAccount.owner.notifyByEmail,
        sms: toAccount.owner.notifyBySMS,
        whatsapp: toAccount.owner.notifyByWhatsapp,
      },
    );

    return tx;
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
