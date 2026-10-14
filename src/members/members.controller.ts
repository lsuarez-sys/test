
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, } from '@nestjs/common';
import { membersService } from './members.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('members')
export class membersController {
  constructor(private membersService: membersService) {}

  // Get all members
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.membersService.getAll();
  }

  // Get single member by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.membersService.findById(+id);
  }

  // Create member
  @Post()
  async create(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email?: string;
      contact_number: number;
    },
  ) {
    return this.membersService.createMember(
      body.first_name,
      body.last_name,
      body.email ?? null,
      body.contact_number,
    );
  }

  // Update member
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      first_name?: string;
      last_name?: string;
      email?: string;
      contact_number?: number;
    },
  ) {
    return this.membersService.updateMember(+id, body);
  }

  // Delete member
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.membersService.deleteMember(+id);
  }
}
