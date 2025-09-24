import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async create(createSongDto: CreateSongDto) {
    const { groups, ...newSong } = createSongDto;
    return await this.prisma.song.create({
      data: {
        ...newSong,
        ...(groups && {
          groups: {
            connect: groups.map((groupId) => ({ id: groupId })),
          },
        }),
      },
    });
  }

  async findAll() {
    Logger.log('GET all songs');
    const result = await this.prisma.song.findMany({
      include: {
        groups: true,
      },
    });
    return result;
  }

  async findOne(id: number) {
    try {
      const result = await this.prisma.song.findUniqueOrThrow({
        where: { id },
        include: { groups: true },
      });
      return result;
    } catch {
      `Песня с ID ${id} не найдена`;
    }
  }

  async update(id: number, updateSongDto: UpdateSongDto) {
    try {
      const existingSong = await this.prisma.song.findUniqueOrThrow({
        where: { id },
        include: { groups: true },
      });
      const { groups, ...songData } = updateSongDto;

      const updateData: any = {
        ...songData,
        ...(groups && {
          set: existingSong.groups.map((group) => ({ id: group.id })),
          connect: groups.map((groupId) => ({ id: groupId })),
        }),
      };

      return this.prisma.song.update({
        where: { id },
        data: updateData,
      });
    } catch {
      console.log(`Песня с ID ${id} не найдена`);
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.song.findUniqueOrThrow({
        where: { id },
      });

      await this.prisma.song.delete({
        where: { id },
      });
    } catch (err) {
      console.log(err);
    }
  }
}