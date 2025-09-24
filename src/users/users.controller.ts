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
  ParseIntPipe,
  HttpException,
  UseInterceptors,
  UploadedFile,
  Res,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

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
    console.log(createUserDto);
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(id);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Deleting user by id' })
  @ApiNoContentResponse({
    description: 'User has been deleted successfully',
  })
  @ApiNotFoundResponse({ description: 'Contact doesn`t exist' })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Get('csv/template')
  @ApiOperation({ description: 'Download CSV template for users import' })
  @ApiOkResponse({ description: 'CSV template file' })
  @HttpCode(200)
  downloadTemplate(@Res() res: Response) {
    return this.usersService.downloadTemplate(res);
  }

  @Post('csv/import')
  @ApiOperation({ description: 'Import users from CSV file' })
  @ApiCreatedResponse({ description: 'Users imported successfully' })
  @ApiConflictResponse({ description: 'Some users already exist or invalid data' })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(201)
  importUsers(@UploadedFile() file: Express.Multer.File) {
    return this.usersService.importUsers(file);
  }
}
