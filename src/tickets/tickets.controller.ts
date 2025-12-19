import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly tickets: TicketsService) {}

  // CUSTOMER
  @Post()
  create(@Req() req: any, @Body() dto: CreateTicketDto) {
    return this.tickets.create(req.user.id, dto);
  }

  // CUSTOMER
  @Get('my')
  myTickets(@Req() req: any) {
    return this.tickets.getMyTickets(req.user.id);
  }
}
