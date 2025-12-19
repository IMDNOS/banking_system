import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
const user= await prisma.user.create({
    data: {
      full_name: 'Mohammad',
      email: 'admin@email.com',
      phone_number: '0123456789',
      password_hash:
        '$2b$10$3TwibwjeznRiKA16ZK5Vw.AzlyDTmsgFExVX4BZw7fIxAxJ6c3lp.',
      role: 'ADMIN',
    },
  });


  await prisma.account.create({
    data: {
      category:"INVESTMENT",
      status:"ACTIVE",
      balance:0,
      interestRate:0.02,
      expectedReturn:0.05,
      account_number:1,
      ownerId:user.id
    },
  });

}

main()
  .then(() => {
    console.log('Seeded!');
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
