import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'prisma/prisma.service';

import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Logger } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const { groups, ...newUser } = createScheduleDto;

    await this.cacheManager.del('allSchedule');
    Logger.log("allSchedule cache has been removed")
    return await this.prisma.schedule.create({
      data: {
        ...newUser,
        ...(groups && {
          connect: groups.map((groupId) => ({ id: groupId })),
        }),
      },
    });
  }

  async findAll() {
    Logger.log('GET all schedules');
    const value = await this.cacheManager.get('allSchedules');

    if (value) {
      Logger.log('"allSchedules" has been taken from cache');
      return value;
    } else {
      const result = await this.prisma.schedule.findMany({
        include: {
          groups: true,
        },
      });
      await this.cacheManager.set('allSchedules', result);
      Logger.log("'allSchedules' has been cached");
      return result;
    }
  }

  async findUserSchedule(userId: number) {
    const schedules = await this.prisma.schedule.findMany({
      where: {
        groups: {
          some: {
            users: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
      include: {
        groups: true,
      },
    });

    return schedules;
  }

  async findOne(id: number) {
    const result = await this.prisma.schedule.findUnique({
      where: { id },
      include: { groups: true },
    });

    if (!result) {
      throw new HttpException(`Расписание с ID ${id} не найдено`, 400);
    }
    return result;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      const existingSchedule = await this.prisma.schedule.findUniqueOrThrow({
        where: { id },
        include: { groups: true },
      });
      const { groups, ...scheduleData } = updateScheduleDto;

      const updateData: any = {
        ...scheduleData,
        ...(groups && {
          set: existingSchedule.groups.map((group) => ({ id: group.id })),
          connect: groups.map((groupId) => ({ id: groupId })),
        }),
      };

      await this.cacheManager.del('allSchedule');
      Logger.log("allSchedule cache has been removed")
      return this.prisma.schedule.update({
        where: { id },
        data: updateData,
      });
    } catch {
      console.log(`Расписание с ID ${id} не найдено`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.schedule.findUniqueOrThrow({
        where: { id },
      });

      await this.prisma.schedule.delete({
        where: { id },
      });

      await this.cacheManager.del('allSchedule');
      Logger.log("allSchedule cache has been removed")
    } catch {
      console.log(`Расписание с ID ${id} не найдено`);
    }
  }
}
