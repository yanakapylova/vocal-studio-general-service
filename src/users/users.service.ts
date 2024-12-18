import { HttpException, Inject, Injectable } from "@nestjs/common";
import { UpdateUserDto } from "src/users/dto/update-user.dto";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from "bcryptjs";

import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";
import { handleError } from "errorHandler";

// TODO: add try/catch where needed
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createUserDto: CreateUserDto) {
    Logger.log("Creating a user");
    const { birthdate, password, groups, ...user } = createUserDto;
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);

    await this.cacheManager.del("allUsers");
    Logger.log("allUsers cache has been removed");

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
    } catch (error) {
      handleError("Error creating a user", error);
    }
  }

  // TODO: add foltering, sorting, pagination
  async findAll() {
    try {
      Logger.log("Getting all users");
      const value = await this.cacheManager.get("allUsers");

      if (value) {
        Logger.log("All users were got successfuly from cache");
        return value;
      } else {
        const result = await this.prisma.user.findMany({
          include: {
            groups: true,
          },
        });
        await this.cacheManager.set("allUsers", result);
        return result;
      }
    } catch (error) {
      handleError("Error retrieving users", error);
    }
  }

  async findOne(id: number) {
    // TODO: Avoid putting all code into try/catch block
    // When you put all code into try-catch you miss details (if user not found it should be 404)
    // If you want to aggregate and log error use global exception filter
    try {
      Logger.log("Getting the user with id " + id);
      const result = await this.prisma.user.findUniqueOrThrow({
        where: { id: id },
        include: { groups: true },
      });

      return result;
    } catch (error) {
      handleError(`Error retrieving the user with id ${id}`, error);
    }
  }

  async findUserByEmail(email: string) {
    try {
      Logger.log("Getting the user with email " + email);
      const user = await this.prisma.user.findUniqueOrThrow({
        where: { email },
        include: { groups: true },
      });
      return user;
    } catch (error) {
      handleError(`Error retrieving the user with email ${email}`, error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      Logger.log("Updating the user with id " + id);
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

      await this.cacheManager.del("allUsers");
      return await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleError(`Error updating the user with id ${id}`, error);
    }
  }

  // TODO: Omit typing, use types inference
  // Write code on TypeScript not on "typed JS"
  // E.g. remove `: Promise<void>` from method signature
  async remove(id: number): Promise<void> {
    Logger.log("Deleting the user with id " + id);
    try {
      await this.prisma.user.findUniqueOrThrow({ where: { id } });

      await this.prisma.user.delete({
        where: { id },
      });

      await this.cacheManager.del("allUsers");
    } catch (error) {
      Logger.error(`Error deleting the user with id ${id}` + error);
    }
  }
}
