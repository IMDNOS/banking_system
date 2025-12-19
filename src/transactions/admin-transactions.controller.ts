import {
  Body,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewTransactionDto } from './dto/review-transaction.dto';
import { UserRole } from '@prisma/client';

@Roles(UserRole.MANAGER, UserRole.ADMIN)
@Controller('admin/transactions')
export class AdminTransactionsController {
  constructor(private readonly tx: TransactionsService) {}

  @Get('pending')
  pending(@Req() req: any) {
    return this.tx.getPendingTransactions(req.user);
  }

  @Post('review')
  review(@Body() dto: ReviewTransactionDto, @Req() req: any) {
    return this.tx.reviewTransaction(dto.transactionId, dto.decision, req.user);
  }
}
