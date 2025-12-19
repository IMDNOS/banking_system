import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
// import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewTransactionDto } from './dto/review-transaction.dto';
import { UserRole } from '@prisma/client';

// @UseGuards(RolesGuard)
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
