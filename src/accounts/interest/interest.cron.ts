// accounts/interest/interest.cron.ts
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma.service';
import { InterestService } from './interest.service';

@Injectable()
export class InterestCron {
  constructor(
    private readonly db: PrismaService,
    private readonly interestService: InterestService,
  ) {}

  // Runs on the 1st of every month at 00:00
  @Cron('0 0 1 * *')
  async applyMonthlyInterest() {
    // Example: 3% annual base (market) rate
    const baseRate = 0.03;

    const accounts = await this.db.account.findMany({
      where: { status: 'ACTIVE' },
      select: { id: true },
    });

    for (const account of accounts) {
      await this.interestService.applyInterest(account.id, baseRate);
    }
  }
}
