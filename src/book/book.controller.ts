import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';
import { bookService } from './book.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('book')
export class bookController {
  constructor(private bookService: bookService) {}

  // Get all books
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.bookService.getAll();
  }

  // Get single book by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.bookService.findById(+id);
  }

  // Create book
  @Post()
  async create(
    @Body()
    body: {
      book_title: string;
      author_id: number;
      category_id: number;
      year_publish: number;
    },
  ) {
    return this.bookService.createBook(
      body.book_title,
      body.author_id,
      body.category_id,
      body.year_publish,
    );
  }

  // Update book
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      book_title?: string;
      author_id?: number;
      category_id?: number;
      year_publish?: number;
    },
  ) {
    return this.bookService.updateBook(+id, body);
  }

  // Delete book
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bookService.deleteBook(+id);
  }
}