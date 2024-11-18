import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupDto } from './dto/group.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Groups')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse({ description: 'Groups are not found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ description: 'Creating a new group' })
  @ApiCreatedResponse({
    description: 'Group has been successfully created',
    type: [CreateGroupDto],
  })
  @ApiConflictResponse({ description: 'Group with given email already exists' })
  @HttpCode(201)
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all groups' })
  @ApiOkResponse({ description: 'List of groups', type: [GroupDto] })
  @HttpCode(200)
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get group by id' })
  @ApiOkResponse({ description: 'Group', type: GroupDto })
  @ApiNotFoundResponse({ description: 'Group doesn`t exist' })
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Updating group by id' })
  @ApiOkResponse({
    description: 'Group has been successfully updated',
    type: GroupDto,
  })
  @ApiNotFoundResponse({
    description: 'Group doesn`t exist',
  })
  @ApiConflictResponse({
    description: 'Group with given name already exists',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deleting group by id' })
  @ApiNoContentResponse({
    description: 'Group has been deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Group doesn`t exist' })
  @HttpCode(204)
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }
}
