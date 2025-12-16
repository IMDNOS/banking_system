import { IsEnum } from 'class-validator';
import { AccountStatus } from '@prisma/client';

export class ChangeAccountStatusDto {
  @IsEnum(AccountStatus)
  status: AccountStatus;
}
