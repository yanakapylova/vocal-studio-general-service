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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse({ description: 'Contacts are not found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ description: 'Creating a new user' })
  @ApiCreatedResponse({
    description: 'User has been successfully created',
    type: [CreateUserDto],
  })
  @ApiConflictResponse({ description: 'User with given email already exists' })
  @HttpCode(201)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ description: 'Get all users' })
  @ApiOkResponse({ description: 'List of users', type: [UserDto] })
  @HttpCode(200)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get user by id' })
  @ApiOkResponse({ description: 'User', type: UserDto })
  @ApiNotFoundResponse({ description: 'User doesn`t exist' })
  @HttpCode(201)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ description: 'Updating contact by id' })
  @ApiOkResponse({
    description: 'User has been successfully updated',
    type: UserDto,
  })
  @ApiNotFoundResponse({
    description: 'User doesn`t exist',
  })
  @ApiConflictResponse({
    description: 'User with given email already exists',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log(id);
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deleting user by id' })
  @ApiNoContentResponse({
    description: 'User has been deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Contact doesn`t exist' })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
