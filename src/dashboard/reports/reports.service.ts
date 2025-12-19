// dashboard/reports/reports.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private readonly db: PrismaService) {}

  // =========================
  // DAILY TRANSACTIONS REPORT
  // =========================
  async dailyTransactions(from?: string, to?: string) {
    return this.db.transaction.findMany({
      where: {
        createdAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        fromAccount: { select: { account_number: true } },
        toAccount: { select: { account_number: true } },
      },
    });
  }

  // =========================
  // ACCOUNT SUMMARY REPORT
  // =========================
  async accountSummaries() {
    return this.db.account.findMany({
      select: {
        id: true,
        account_number: true,
        balance: true,
        status: true,
        category: true,
        owner: {
          select: {
            full_name: true,
            email: true,
          },
        },
        _count: {
          select: {
            incomingTransactions: true,
            outgoingTransactions: true,
          },
        },
      },
    });
  }

  // =========================
  // AUDIT LOGS REPORT
  // =========================
  async auditLogs(from?: string, to?: string) {
    return this.db.auditLog.findMany({
      where: {
        createdAt: {
          gte: from ? new Date(from) : undefined,
          lte: to ? new Date(to) : undefined,
        },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        performedBy: {
          select: {
            full_name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  // =========================
  // QUICK SUPPORT STATS
  // =========================
  async supportSnapshot() {
    const [failed, pending] = await this.db.$transaction([
      this.db.transaction.count({
        where: { status: TransactionStatus.REJECTED },
      }),
      this.db.transaction.count({
        where: {
          status: {
            in: [
              TransactionStatus.REQUIRES_MANAGER,
              TransactionStatus.REQUIRES_ADMIN,
            ],
          },
        },
      }),
    ]);

    return {
      failedTransactions: failed,
      pendingApprovals: pending,
    };
  }
}
