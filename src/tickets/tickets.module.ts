import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaService } from '../prisma.service';
import { StaffTicketsController } from './staff-tickets.controller';

@Module({
  controllers: [TicketsController, StaffTicketsController],
  providers: [TicketsService, PrismaService],
})
export class TicketsModule {}
