import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';

// TODO: add try/catch where needed
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, groups, ...user } = createUserDto;
    const hash = await bcrypt.hash(password, process.env.SALT);

    await this.cacheManager.del('allUsers');
    Logger.log("allUsers cache has been removed")
    return this.prisma.user.create({
      data: {
        ...user,
        ...(groups && {
          connect: groups.map((groupId) => ({ id: groupId })),
        }),
        password: hash,
      },
      include: {
        groups: true,
      },
    });
  }

  // TODO: add foltering, sorting, pagination
  async findAll() {
    Logger.log('GET all users');
    const value = await this.cacheManager.get('allUsers');

    if (value) {
      Logger.log('"allUsers" has been taken from cache');
      return value;
    } else {
      const result = await this.prisma.user.findMany({
        include: {
          groups: true,
        },
      });
      await this.cacheManager.set('allUsers', result);
      Logger.log("'allUsers' has been cached");
      return result;
    }
  }

  async findOne(id: number) {
    const result = await this.prisma.user.findUniqueOrThrow({
      where: { id: id },
      include: { groups: true },
    });

    return result;
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
        include: { groups: true },
      });
      return user;
    } catch (error) {
      console.error('Error retrieving user:', error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

    await this.cacheManager.del('allUsers');
    Logger.log("allUsers cache has been removed")
    return await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<void> {
    try {
      await this.prisma.user.findUniqueOrThrow({ where: { id } });

      await this.prisma.user.delete({
        where: { id },
      });

      await this.cacheManager.del('allUsers');
      Logger.log("allUsers cache has been removed")
    } catch {
      console.log(`Пользователь с ID ${id} не найден`);
    }
  }
}
