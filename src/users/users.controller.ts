import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Get all users (protected)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.usersService.getAll();
  }

  // Get single user by id (protected)
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  // Create user (open - for demo)
  @Post()
  async create(@Body() body: { username: string; password: string; role?: string }) {
    try {
      return await this.usersService.createUser(body.username, body.password, body.role || 'user');
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username is already taken');
      }
      throw err;
    }
  }

  // Update user (protected)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      return await this.usersService.updateUser(+id, body);
    } catch (err: any) {
      if (err?.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username is already taken');
      }
      throw err;
    }
  }

  // Delete user (protected)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}