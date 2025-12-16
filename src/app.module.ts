import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [AuthModule, UsersModule, AccountsModule],
  providers: [PrismaService],
})
export class AppModule {}
