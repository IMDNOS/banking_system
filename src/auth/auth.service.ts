import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(email: string, password: string, accountNumber: number) {
    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        password_hash: true,
        role: true,
        accounts: {
          select: {
            id: true,
            account_number: true,
          },
        },
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const account = user.accounts.find(
      (acc) => acc.account_number === accountNumber,
    );

    if (!account) {
      throw new UnauthorizedException('Account does not belong to user');
    }

    // ✅ JWT can optionally include activeAccountId
    return {
      access_token: this.jwt.sign({
        sub: user.id,
        role: user.role,
        accountId: account.id,
      }),
    };
  }

}
