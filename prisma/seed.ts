import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const schedule1 = await prisma.schedule.create({
    data: {
      type: 'permanent',
      day: 'ПН',
      time: '19:00',
      place: 'ГЦК',
      durationMin: 90,
      activity: 'vocal',
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      type: 'additional',
      date: new Date(2024, 11, 21),
      time: '16:00',
      place: 'ГЦК',
      durationMin: 90,
      activity: 'vocal',
    },
  });

  const schedule3 = await prisma.schedule.create({
    data: {
      type: 'concert',
      date: new Date(2024, 11, 21),
      time: '18:00',
      place: 'ГЦК',
      durationMin: 90,
      activity: 'vocal',
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

  const song1 = await prisma.song.upsert({
    where: { name: 'Будь первым' },
    update: {},
    create: {
      name: 'Crystal',
      duration: '3:48',
      theme: 'Вдохновляющая',
      groups: {
        connect: [{ id: 1 }],
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
      fathername: 'A',
      birthdate: new Date(1999, 10, 26),
      email: 'yana@gmail.com',
      password: hash1,
      role: 'student',
      school: 'Какая-то школа',
      address: 'Какай-то адрес',
      groups: {
        connect: [{ id: 1 }],
      },
      photoURL: null,
    },
  });

  const hash2 = await bcrypt.hash('qwerty', salt);
  const teacher = await prisma.user.upsert({
    where: { email: 'kristina@gmail.com' },
    update: {},
    create: {
      name: 'Kristina',
      surname: 'R',
      fathername: 'A',
      birthdate: new Date(1975, 7, 3),
      email: 'kristina@gmail.com',
      password: hash2,
      role: 'teacher',
      groups: {
        connect: [{ id: 1 }],
      },
      photoURL: '',
    },
  });

  console.log({
    schedule1,
    schedule2,
    schedule3,
    group1,
    song1,
    student,
    teacher,
  });
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
