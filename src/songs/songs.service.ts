import { Inject, Injectable } from "@nestjs/common";
import { CreateSongDto } from "./dto/create-song.dto";
import { UpdateSongDto } from "./dto/update-song.dto";
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Logger } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { handleError } from "errorHandler";

@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create(createSongDto: CreateSongDto) {
    Logger.log("Creating a song");
    const { groups, ...newSong } = createSongDto;

    await this.cacheManager.del("allSongs");
    Logger.log("allSongs cache has been removed");

    try {
      return await this.prisma.group.create({
        data: {
          ...newSong,
          ...(groups && {
            connect: groups.map((groupId) => ({ id: groupId })),
          }),
        },
      });
    } catch (error) {
      handleError("Error creating a song", error);
    }
  }

  async findAll() {
    try {
      Logger.log("Getting all songs");
      const value = await this.cacheManager.get("allSongs");

      if (value) {
        Logger.log('"allSongs" has been taken from cache');
        return value;
      } else {
        const result = await this.prisma.song.findMany({
          include: {
            groups: true,
          },
        });
        await this.cacheManager.set("allSongs", result);
        Logger.log("'allSongs' has been cached");
        return result;
      }
    } catch (error) {
      handleError("Error retrieving songs", error);
    }
  }

  async findOne(id: number) {
    try {
      Logger.log("Getting the song with id " + id);
      const result = await this.prisma.song.findUniqueOrThrow({
        where: { id },
        include: {
          groups: true,
        },
      });
      return result;
    } catch (error) {
      handleError(`Error retrieving the song with id ${id}`, error);
    }
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    try {
      Logger.log("Updating the song with id " + id);
      const existingSong = await this.prisma.song.findUniqueOrThrow({
        where: { id },
        include: {
          groups: true,
        },
      });

      const { groups } = updateSongDto;

      const updateData: any = {
        ...(groups && {
          set: existingSong.groups.map((user) => ({ id: user.id })),
          connect: groups.map((userId) => ({ id: userId })),
        }),
      };

      await this.cacheManager.del("allSongs");
      Logger.log("allSongs cache has been removed");
      return await this.prisma.song.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      handleError(`Error updating the song with id ${id}`, error);
    }
  }

  async remove(id: number) {
    try {
      Logger.log("Deleting the song with id " + id);
      await this.prisma.song.findUniqueOrThrow({
        where: { id },
      });

      await this.prisma.song.delete({
        where: { id },
      });

      await this.cacheManager.del("allSongs");
      Logger.log("allSongs cache has been removed");
    } catch (error) {
      Logger.error(`Error deleting the song with id ${id}` + error);
    }
  }
}
