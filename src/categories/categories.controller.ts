import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards,
} from '@nestjs/common';

import { categoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
export class categoriesController {
  constructor(private categoriesService: categoriesService) {}

  // Get all categories
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.categoriesService.getAll();
  }

  // Get single category by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.categoriesService.findById(+id);
  }

  // Create category
  @Post()
  async create(
    @Body()
    body: {
      category_name: string;
      author_id: number;
    },
  ) {
    return this.categoriesService.createCategories(
      body.category_name,
      body.author_id,
    );
  }

  // Update category
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      category_name?: string;
      author_id?: number;
    },
  ) {
    return this.categoriesService.updateCategories(+id, body);
  }

  // Delete category
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.categoriesService.deleteCategories(+id);
  }
}