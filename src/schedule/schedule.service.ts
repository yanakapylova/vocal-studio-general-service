import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
import { PrismaService } from "prisma/prisma.service";

import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";
import { handleError } from "errorHandler";

@Injectable()
export class ScheduleService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createScheduleDto: CreateScheduleDto) {
    Logger.log("Creating a schedule");
    const { date, groups, ...newSchedule } = createScheduleDto;

    await this.cacheManager.del("allSchedules");
    Logger.log("allSchedule cache has been removed");

    try {
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
    } catch (error) {
      handleError("Error creating a schedule", error);
    }
  }

  async findAll() {
    try {
      Logger.log("Getting all schedules");
      const value = await this.cacheManager.get("allSchedules");

      if (value) {
        Logger.log('"allSchedules" has been taken from cache');
        return value;
      } else {
        const result = await this.prisma.schedule.findMany({
          include: {
            groups: true,
          },
        });
        await this.cacheManager.set("allSchedules", result);
        Logger.log("'allSchedules' has been cached");
        return result;
      }
    } catch (error) {
      handleError("Error retrieving schedules", error);
    }
  }

  async findUserSchedule(userId: number) {
    try {
      Logger.log("Getting the schedule of user with id " + userId);

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
    } catch (error) {
      handleError(
        `Error retrieving the schedule of the user with id ${userId}`,
        error
      );
    }
  }

  async findOne(id: number) {
    Logger.log("Getting the schedule with id " + id);

    try {
      console.log(id);
      const result = await this.prisma.schedule.findUniqueOrThrow({
        where: { id: id },
        // include: { groups: true },
      });
      return result;
    } catch (error) {
      handleError(`Error retrieving the schedule with id ${id}`, error);
    }
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto) {
    try {
      Logger.log("Updating the schedule with id " + id);
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

      await this.cacheManager.del("allSchedules");
      Logger.log("allSchedule cache has been removed");
      return this.prisma.schedule.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleError(`Error updating the schedule with id ${id}`, error);
    }
  }

  async remove(id: number) {
    try {
      Logger.log("Deleting the schedule with id " + id);
      await this.prisma.schedule.findUniqueOrThrow({
        where: { id },
      });

      await this.prisma.schedule.delete({
        where: { id },
      });

      await this.cacheManager.del("allSchedules");
      Logger.log("allSchedule cache has been removed");
    } catch (error) {
      Logger.error(`Error deleting the schedule with id ${id}` + error);
    }
  }
}
