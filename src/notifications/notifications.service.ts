import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: PrismaService) {}

  async getLast30(accountId: string) {
    return this.db.notifications.findMany({
      where: {
        account_id: accountId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 30,
      select: {
        id: true,
        message: true,
        transaction_id: true,
        createdAt: true,
      },
    });
  }
}
