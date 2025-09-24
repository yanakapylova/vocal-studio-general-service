import { HttpException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

import { Logger } from '@nestjs/common';
import { Http2ServerRequest } from 'http2';
import { handleError } from 'errorHandler';

// TODO: add try/catch where needed
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    Logger.log('Creating a user');
    const { birthdate, password, groups, ...user } = createUserDto;
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);

    try {
      return this.prisma.user.create({
        data: {
          birthdate: new Date(birthdate),
          ...user,
          ...(groups && {
            groups: {
              connect: groups.map((groupId) => ({ id: groupId })),
            },
          }),
          password: hash,
        },
        include: {
          groups: true,
        },
      });
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }

  // TODO: add foltering, sorting, pagination
  async findAll() {
    try {
      Logger.log('Getting all users');
      const result = await this.prisma.user.findMany({
        include: {
          groups: true,
        },
      });

      Logger.log('All users were got successfuly');
      return result;
    } catch (error) {
      handleError('Error retrieving users', error);
    }
  }

  async findOne(id: number) {
    try {
      Logger.log('Getting the user with id ' + id);
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { id: id },
        include: { groups: true },
      });

      return result;
    } catch (error) {
      handleError('Error retrieving user', error);
    }
  }

  async findUserByEmail(email: string) {
    try {
      Logger.log('Getting the user with email ' + email);
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
        include: { groups: true },
      });
      return user;
    } catch (error) {
      handleError('Error retrieving user', error);
    }
  }

  async findUserForAuth(email: string) {
    try {
      Logger.log('Getting the user for auth with email ' + email);
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true },
      });
      return user;
    } catch (error) {
      handleError('Error retrieving user for auth', error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      Logger.log('Updating the user with id ' + id);
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { id },
        include: { groups: true },
      });

      const { groups, ...userData } = updateUserDto;

      const updateData: any = {
        ...userData,
        ...(groups && {
          disconnect: user.groups.map((group) => ({ id: +group.id })),
          connect: groups.map((groupId) => ({ id: +groupId })),
        }),
      };

      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleError('Error retrieving user', error);
    }
  }

  async remove(id: number): Promise<void> {
    Logger.log('Deleting the user with id ' + id);
    try {
      await this.prisma.user.findUniqueOrThrow({ where: { id } });

      await this.prisma.user.delete({
        where: { id },
      });

    } catch (error) {
      Logger.error('Error retrieving user: ' + error);
    }
  }

  async downloadTemplate(res: Response) {
    try {
      Logger.log('Generating CSV template');
      
      // Получаем все существующие группы
      const groups = await this.prisma.group.findMany();
      const groupNames = groups.map(group => group.name).join(', ');
      
      const csvContent = 'name,surname,fathername,email,password,role,birthdate,school,address,groups\n' +
        `Иван,Иванов,Иванович,ivan@example.com,password123,student,2000-01-01,Школа №1,ул. Примерная 1,${groupNames || 'Группа 1'}\n` +
        `Петр,Петров,Петрович,petr@example.com,password123,student,2001-02-02,Школа №2,ул. Тестовая 2,${groupNames || 'Группа 2'}\n` +
        `\n# Доступные группы: ${groupNames || 'Создайте группы в системе'}\n` +
        '# Формат групп: можно указать несколько групп через запятую (например: Группа 1, Группа 2)\n' +
        '# Роли: student, teacher, admin\n' +
        '# Дата рождения в формате: YYYY-MM-DD\n' +
        '# Пароль будет автоматически захеширован при импорте';

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="users_template.csv"');
      res.send(csvContent);
    } catch (error) {
      handleError('Error generating CSV template', error);
    }
  }

  async importUsers(file: Express.Multer.File) {
    try {
      Logger.log('Importing users from CSV');
      
      if (!file) {
        throw new HttpException('No file uploaded', 400);
      }

      const results = [];
      const errors = [];
      
      // Парсим CSV файл
      const stream = Readable.from(file.buffer);
      
      await new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      // Получаем все группы для сопоставления имен с ID
      const groups = await this.prisma.group.findMany();
      const groupMap = new Map(groups.map(group => [group.name, group.id]));

      const createdUsers = [];
      
      for (const [index, row] of results.entries()) {
        try {
          // Валидация обязательных полей
          if (!row.name || !row.surname || !row.email || !row.role || !row.birthdate) {
            errors.push(`Строка ${index + 2}: Отсутствуют обязательные поля`);
            continue;
          }

          // Проверяем, существует ли пользователь с таким email
          const existingUser = await this.prisma.user.findUnique({
            where: { email: row.email }
          });

          if (existingUser) {
            errors.push(`Строка ${index + 2}: Пользователь с email ${row.email} уже существует`);
            continue;
          }

          // Обрабатываем группы
          const groupNames = row.groups ? row.groups.split(',').map((name: string) => name.trim()) : [];
          const groupIds = groupNames
            .map((name: string) => groupMap.get(name))
            .filter((id: number) => id !== undefined);

          // Хешируем пароль
          const salt = 10;
          const hashedPassword = await bcrypt.hash(row.password || 'defaultPassword123', salt);

          // Создаем пользователя
          const user = await this.prisma.user.create({
            data: {
              name: row.name,
              surname: row.surname,
              fathername: row.fathername || '',
              email: row.email,
              password: hashedPassword,
              role: row.role as any,
              birthdate: new Date(row.birthdate),
              school: row.school || null,
              address: row.address || null,
              groups: {
                connect: groupIds.map(id => ({ id }))
              }
            },
            include: {
              groups: true
            }
          });

          createdUsers.push(user);
        } catch (error) {
          errors.push(`Строка ${index + 2}: ${error.message}`);
        }
      }

      return {
        success: true,
        created: createdUsers.length,
        errors: errors,
        users: createdUsers
      };
    } catch (error) {
      handleError('Error importing users from CSV', error);
    }
  }
}
