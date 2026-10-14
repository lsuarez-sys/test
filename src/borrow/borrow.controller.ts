
import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { borrowService } from './borrow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('borrow')
export class borrowController {
  constructor(private borrowService: borrowService) {}

  // Get all borrow records
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.borrowService.getAll();
  }

  // Get single borrow record by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.borrowService.findById(+id);
  }

  // Create borrow record
  @Post()
  async create(
    @Body()
    body: {
      member_id: number;
      book_id: number;
      borrow_date: string;
      return_date: string;
    },
  ) {
    return this.borrowService.createBorrow(
      body.member_id,
      body.book_id,
      body.borrow_date,
      body.return_date,
    );
  }

  // Update borrow record
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      member_id?: number;
      book_id?: number;
      borrow_date?: string;
      return_date?: string;
    },
  ) {
    return this.borrowService.updateBorrow(+id, body);
  }

  // Delete borrow record
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.borrowService.deleteBorrow(+id);
  }
}
