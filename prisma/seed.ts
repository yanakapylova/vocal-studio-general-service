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

  const group2 = await prisma.group.upsert({
    where: { name: 'Тип-топ' },
    update: {},
    create: {
      name: 'Тип-топ',
    },
  });

  const group3 = await prisma.group.upsert({
    where: { name: 'Crystal Kids' },
    update: {},
    create: {
      name: 'Crystal Kids',
    },
  });

  const song1 = await prisma.song.upsert({
    where: { name: 'Будь первым' },
    update: {},
    create: {
      name: 'Будь первым',
      duration: '3:48',
      theme: 'Вдохновляющая',
      groups: {
        connect: [{ id: 1 }],
      },
    },
  });

  const song2 = await prisma.song.upsert({
    where: { name: 'Звездный путь' },
    update: {},
    create: {
      name: 'Звездный путь',
      duration: '4:12',
      theme: 'Космическая',
      groups: {
        connect: [{ id: 2 }],
      },
    },
  });

  const song3 = await prisma.song.upsert({
    where: { name: 'Детские мечты' },
    update: {},
    create: {
      name: 'Детские мечты',
      duration: '3:25',
      theme: 'Детская',
      groups: {
        connect: [{ id: 3 }],
      },
    },
  });

  const salt = 10;
  const hash1 = await bcrypt.hash('qwerty', salt);

  const student1 = await prisma.user.upsert({
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

  const student2 = await prisma.user.upsert({
    where: { email: 'anna@gmail.com' },
    update: {},
    create: {
      name: 'Anna',
      surname: 'Petrova',
      fathername: 'Vladimirovna',
      birthdate: new Date(2005, 3, 15),
      email: 'anna@gmail.com',
      password: hash1,
      role: 'student',
      school: 'Школа №1',
      address: 'ул. Ленина, 10',
      groups: {
        connect: [{ id: 1 }, { id: 2 }],
      },
      photoURL: null,
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'maria@gmail.com' },
    update: {},
    create: {
      name: 'Maria',
      surname: 'Ivanova',
      fathername: 'Sergeevna',
      birthdate: new Date(2007, 8, 22),
      email: 'maria@gmail.com',
      password: hash1,
      role: 'student',
      school: 'Гимназия №2',
      address: 'пр. Победы, 5',
      groups: {
        connect: [{ id: 2 }],
      },
      photoURL: null,
    },
  });

  const student4 = await prisma.user.upsert({
    where: { email: 'elena@gmail.com' },
    update: {},
    create: {
      name: 'Elena',
      surname: 'Sidorova',
      fathername: 'Nikolaevna',
      birthdate: new Date(2006, 11, 8),
      email: 'elena@gmail.com',
      password: hash1,
      role: 'student',
      school: 'Лицей №3',
      address: 'ул. Мира, 15',
      groups: {
        connect: [{ id: 3 }],
      },
      photoURL: null,
    },
  });

  const student5 = await prisma.user.upsert({
    where: { email: 'sofia@gmail.com' },
    update: {},
    create: {
      name: 'Sofia',
      surname: 'Kozlova',
      fathername: 'Andreevna',
      birthdate: new Date(2008, 1, 30),
      email: 'sofia@gmail.com',
      password: hash1,
      role: 'student',
      school: 'Школа №4',
      address: 'ул. Садовая, 20',
      groups: {
        connect: [{ id: 3 }],
      },
      photoURL: null,
    },
  });

  const student6 = await prisma.user.upsert({
    where: { email: 'daria@gmail.com' },
    update: {},
    create: {
      name: 'Daria',
      surname: 'Morozova',
      fathername: 'Dmitrievna',
      birthdate: new Date(2004, 6, 12),
      email: 'daria@gmail.com',
      password: hash1,
      role: 'student',
      school: 'Школа №5',
      address: 'ул. Центральная, 7',
      groups: {
        connect: [{ id: 1 }, { id: 3 }],
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
    schedules: [schedule1, schedule2, schedule3],
    groups: [group1, group2, group3],
    songs: [song1, song2, song3],
    students: [student1, student2, student3, student4, student5, student6],
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
