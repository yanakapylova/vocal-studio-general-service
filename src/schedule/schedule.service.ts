import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { PrismaService } from 'prisma/prisma.service';

import { Logger } from '@nestjs/common';

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    const { date, groups, ...newSchedule } = createScheduleDto;

    return await this.prisma.schedule.create({
      data: {
        date: new Date(date),
        ...newSchedule,
        ...(groups && {
          groups: {
            connect: groups.map((groupId) => ({ id: groupId })),
          },
        }),
      },
    });
  }

  async findAll() {
    Logger.log('GET all schedules');
    const [permanentSchedules, additionalSchedules, concertSchedules] = await Promise.all([
      this.prisma.schedule.findMany({
        where: { type: 'permanent' },
        include: {
          groups: true,
        },
      }),
      this.prisma.schedule.findMany({
        where: { type: 'additional' },
        include: {
          groups: true,
        },
      }),
      this.prisma.schedule.findMany({
        where: { type: 'concert' },
        include: {
          groups: true,
        },
      }),
    ]);

    return {
      permanentSchedules,
      additionalSchedules,
      concertSchedules,
    };
  }

  async findUserSchedule(userId: number) {
    const [permanentSchedules, additionalSchedules, concertSchedules] = await Promise.all([
      this.prisma.schedule.findMany({
        where: {
          type: 'permanent',
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
      }),
      this.prisma.schedule.findMany({
        where: {
          type: 'additional',
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
      }),
      this.prisma.schedule.findMany({
        where: {
          type: 'concert',
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
      }),
    ]);

    return {
      permanentSchedules,
      additionalSchedules,
      concertSchedules,
    };
  }

  async findOne(id: number) {
    try {
      console.log(id);
      const result = await this.prisma.schedule.findUniqueOrThrow({
        where: { id: id },
        // include: { groups: true },
      });
      return result;
    } catch (err) {
      console.log(err);
      throw new HttpException(
        `Schedule with id ${id} is not found`,
        HttpStatus.NOT_FOUND,
      );
    }
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
    } catch (err) {
      console.log(err);
    }
  }
}