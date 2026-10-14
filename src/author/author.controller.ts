import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, } from '@nestjs/common';
import { authorService } from './author.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('author')
export class authorController {
  constructor(private authorService: authorService) {}

  // Get all authors
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.authorService.getAll();
  }

  // Get single author by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.authorService.findById(+id);
  }

  // Create author
  @Post()
  async create(
    @Body()
    body: {
      author_name: string;
      nationality: string;
    },
  ) {
    return this.authorService.createAuthor(
      body.author_name,
      body.nationality,
    );
  }

  // Update author
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      author_name?: string;
      nationality?: string;
    },
  ) {
    return this.authorService.updateAuthor(+id, body);
  }

  // Delete author
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authorService.deleteAuthor(+id);
  }
}