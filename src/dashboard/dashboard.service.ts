import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TransactionStatus } from '@prisma/client';

// dashboard.service.ts
@Injectable()
export class DashboardService {
  constructor(private readonly db: PrismaService) {}

  async systemHealth() {
    let dbStatus: 'UP' | 'DOWN' = 'UP';

    try {
      await this.db.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = 'DOWN';
    }

    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
      db: dbStatus,
    };
  }


  async getBusinessMetrics() {
    const [
      users,
      accounts,
      totalBalance,
      transactionsToday,
      pendingApprovals,
    ] = await this.db.$transaction([
      this.db.user.count(),
      this.db.account.count(),
      this.db.account.aggregate({
        _sum: { balance: true },
      }),
      this.db.transaction.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
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
      users,
      accounts,
      totalBalance: totalBalance._sum.balance ?? 0,
      transactionsToday,
      pendingApprovals,
    };
  }

  async ticketMetrics() {
    const [open, inProgress] = await this.db.$transaction([
      this.db.supportTicket.count({ where: { status: 'OPEN' } }),
      this.db.supportTicket.count({ where: { status: 'IN_PROGRESS' } }),
    ]);

    return { open, inProgress };
  }


  async failedTransactions() {
    return this.db.transaction.findMany({
      where: { status: TransactionStatus.REJECTED },
      orderBy: { createdAt: 'desc' },
      // take: limit,
    });
  }


}
