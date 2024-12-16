import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";
import { handleError } from "errorHandler";

@Injectable()
export class GroupsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createGroupDto: CreateGroupDto) {
    try {
      Logger.log("Creating a group");
      const { name, users, schedules, songs } = createGroupDto;
      await this.cacheManager.del("allGroups");
      Logger.log("allGroups cache has been removed");
      return await this.prisma.group.create({
        data: {
          name,
          ...(users && {
            connect: users.map((userId) => ({ id: userId })),
          }),
          ...(schedules && {
            connect: schedules.map((scheduleId) => ({ id: scheduleId })),
          }),
          ...(songs && {
            connect: songs.map((songId) => ({ id: songId })),
          }),
        },
      });
    } catch (error) {
      handleError("Error creating a group", error);
    }
  }

  async findAll() {
    try {
      Logger.log("Getting all groups");
      await this.cacheManager.del("allGroups");
      Logger.log("allGroups cache has been removed");
      Logger.log("GET all groups");
      const value = await this.cacheManager.get("allGroups");

      if (value) {
        Logger.log('"allGroups" has been taken from cache');
        return value;
      } else {
        const result = await this.prisma.group.findMany({
          include: {
            songs: true,
          },
        });
        await this.cacheManager.set("allGroups", result);
        Logger.log("'allGroups' has been cached");
        return result;
      }
    } catch (error) {
      handleError("Error retrieving groups", error);
    }
  }

  async findOne(id: number) {
    try {
      Logger.log("Getting the group with id " + id);
      const result = await this.prisma.group.findUniqueOrThrow({
        where: { id },
        include: { users: true, schedules: true, songs: true },
      });
      return result;
    } catch (error) {
      handleError(`Error retrieving the group with id ${id}`, error);
    }
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    try {
      Logger.log("Updating the group with id " + id);
      const existingGroup = await this.prisma.group.findUniqueOrThrow({
        where: { id },
        include: { users: true, schedules: true },
      });

      const { users, schedules, ...groupData } = updateGroupDto;

      const updateData: any = {
        ...groupData,
        ...(users && {
          set: existingGroup.users.map((user) => ({ id: user.id })),
          connect: users.map((userId) => ({ id: userId })),
        }),
        ...(schedules && {
          set: existingGroup.schedules.map((schedule) => ({ id: schedule.id })),
          connect: schedules.map((scheduleId) => ({ id: scheduleId })),
        }),
      };

      await this.cacheManager.del("allGroups");
      Logger.log("allGroups cache has been removed");
      return await this.prisma.group.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleError(`Error updating the group with id ${id}`, error);
    }
  }

  async remove(id: number) {
    try {
      Logger.log("Deleting the group with id " + id);
      await this.prisma.group.findUniqueOrThrow({
        where: { id },
      });

      await this.prisma.group.delete({
        where: { id },
      });

      await this.cacheManager.del("allGroups");
      Logger.log("allGroups cache has been removed");
    } catch (error) {
      Logger.error(`Error deleting the group with id ${id}` + error);
    }
  }
}
