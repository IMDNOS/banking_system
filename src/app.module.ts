import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { AuditModule } from './audit/audit.module';
import { AuditService } from './audit/audit.service';
import { TicketsModule } from './tickets/tickets.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    AccountsModule,
    TransactionsModule,
    NotificationsModule,
    AuditModule,
    TicketsModule,
    DashboardModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PrismaService,
    AuditService,
  ],
})
export class AppModule {}
