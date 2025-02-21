import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  ParseIntPipe,
  Patch,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // GET /users?limit=10&page=1
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.usersService.findAll(page, limit);
  }

   // DELETE /users/:id
   @Delete(':id')
   async softDelete(@Param('id', ParseIntPipe) id: number) {
     return this.usersService.softDelete(id);
   }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
  /**Patch endpoint */
  @Patch(':id')
  public async updateUser( @Body() updateUserDto:UpdateUserDto, @Param('id', ParseIntPipe) id:number ){
    const user = await this.usersService.updateUser(id, updateUserDto)
    
    /**if user does not exist */
    if (!user){
      throw new NotFoundException('No user was found')
    }
    return user
  }
}
