import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { ScheduleDto } from './dto/schedule.dto';

@ApiTags('Schedule')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse({ description: 'Schedule is not found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @ApiOperation({ description: 'Creating a new schedule' })
  @ApiCreatedResponse({
    description: 'Schedule has been successfully created',
    type: [CreateScheduleDto],
  })
  @HttpCode(201)
  create(@Body() createScheduleDto: CreateScheduleDto) {
    return this.scheduleService.create(createScheduleDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all schedule' })
  @ApiOkResponse({ description: 'List of schedule', type: [ScheduleDto] })
  @HttpCode(200)
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get schedule by id' })
  @ApiOkResponse({ description: 'Schedule', type: ScheduleDto })
  @ApiNotFoundResponse({ description: 'Schedule doesn`t exist' })
  @HttpCode(200)
  findOne(@Param('id') id: number) {
    return this.scheduleService.findOne(id);
  }

  @Get('user/:id')
  @ApiOperation({ description: "Get schedule by user's id" })
  @ApiOkResponse({ description: 'Schedule', type: ScheduleDto })
  @ApiNotFoundResponse({ description: 'Schedule/User doesn`t exist' })
  @HttpCode(200)
  async getUserSchedule(@Param('id') id: number) {
    return await this.scheduleService.findUserSchedule(id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Updating contact by id' })
  @ApiOkResponse({
    description: 'Schedule has been successfully updated',
    type: ScheduleDto,
  })
  @ApiNotFoundResponse({
    description: 'Schedule doesn`t exist',
  })
  @HttpCode(204)
  update(
    @Param('id') id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(id, updateScheduleDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deleting user by id' })
  @ApiNoContentResponse({
    description: 'Schedule has been deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Contact doesn`t exist' })
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return this.scheduleService.remove(id);
  }
}
