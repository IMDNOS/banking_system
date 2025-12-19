import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { CreateTransferDto } from './dto/create-transfer.dto';

@Controller('transactions')
export class UserTransactionsController {
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
      dto.toAccountNumber,
      dto.amount,
    );
  }

  @Get('account_history')
  history( @Req() req: any) {
    return this.tx.getAccountTransactions(req.user.accountId, req.user);
  }
}
