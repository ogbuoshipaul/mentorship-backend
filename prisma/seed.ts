import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('DSApassword123', 10);

  const mentees = Array.from({ length: 10 }).map((_, i) => ({
    name: `Mentee ${i + 1}`,
    email: `mentee${i + 1}@example.com`,
    password: hashedPassword,
    role: 'MENTEE',
  }));

  const mentors = Array.from({ length: 10 }).map((_, i) => ({
    name: `Mentor ${i + 1}`,
    email: `mentor${i + 1}@example.com`,
    password: hashedPassword,
    role: 'MENTOR',
  }));

  const admins = [
    {
      name: 'Admin 1',
      email: 'admin1@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
    {
      name: 'Admin 2',
      email: 'admin2@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  ];

  // Insert users in batches
  await prisma.user.createMany({
    data: [...mentees, ...mentors, ...admins],
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
