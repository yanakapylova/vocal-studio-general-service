import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const schedule1 = await prisma.schedule.create({
    data: {
      type: 'permanent',
      date: 'ПН',
      time: '19:00',
      place: 'ГЦК',
      durationMin: 90,
      activity: 'Вокал',
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      type: 'additional',
      date: '21.01',
      time: '18:00',
      place: 'ГЦК',
      durationMin: 90,
      activity: 'Вокал',
    },
  });

  const schedule3 = await prisma.schedule.create({
    data: {
      type: 'concert',
      date: '22.01',
      time: '15:00',
      place: 'ГЦК',
      durationMin: 90,
      activity: 'Вокал',
    },
  });

  const group1 = await prisma.group.upsert({
    where: { name: 'Crystal' },
    update: {},
    create: {
      name: 'Crystal',
      schedules: {
        connect: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    },
  });

  const salt = 10;
  const hash1 = await bcrypt.hash('qwerty', salt);

  const student = await prisma.user.upsert({
    where: { email: 'yana@gmail.com' },
    update: {},
    create: {
      name: 'Yana',
      surname: 'K',
      birthdate: '26.10.1999',
      email: 'yana@gmail.com',
      password: hash1,
      role: 'student',
      groups: {
        connect: [{ id: 1 }],
      },
      photoURL: '',
    },
  });

  const hash2 = await bcrypt.hash('qwerty', salt);
  const teacher = await prisma.user.upsert({
    where: { email: 'kristina@gmail.com' },
    update: {},
    create: {
      name: 'Kristina',
      surname: 'R',
      birthdate: '03.07.1975',
      email: 'kristina@gmail.com',
      password: hash2,
      role: 'teacher',
      groups: {
        connect: [{ id: 1 }],
      },
      photoURL: '',
    },
  });

  console.log({ schedule1, schedule2, schedule3, group1, student, teacher });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
