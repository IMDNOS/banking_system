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
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { ReviewTransactionDto } from './dto/review-transaction.dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly tx: TransactionsService) {}

  @Post('deposit')
  deposit(@Body() dto: CreateDepositDto, @Req() req: any) {
    return this.tx.deposit(req.user.accountId, dto.amount);
  }

  @Post('withdraw')
  withdraw(@Body() dto: CreateWithdrawDto, @Req() req: any) {
    return this.tx.withdraw(req.user.accountId, dto.amount);
  }

  @Post('transfer')
  transfer(@Body() dto: CreateTransferDto, @Req() req: any) {
    return this.tx.transfer(
      req.user.accountId,
      dto.toAccountId,
      dto.amount,
    );
  }

  @Get('account/:id')
  history(@Param('id') id: string, @Req() req: any) {
    return this.tx.getAccountTransactions(id, req.user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Get('pending')
  pending(@Req() req: any) {
    return this.tx.getPendingTransactions(req.user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Post(':id/review')
  review(
    @Param('id') id: string,
    @Body() dto: ReviewTransactionDto,
    @Req() req: any,
  ) {
    return this.tx.reviewTransaction(id, dto.decision, req.user);
  }

}
