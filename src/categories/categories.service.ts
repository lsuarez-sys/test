import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class categoriesService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createCategories(category_name: string, author_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO categories (category_name, author_id) VALUES (?, ?)',
      [category_name, author_id],
    );

    return {
      category_id: result.insertId,
      category_name,
      author_id,
    };
  }

  async findById(category_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, author_id FROM categories WHERE category_id = ?',
      [category_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return rows[0];
  }

  async findByName(category_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, author_id FROM categories WHERE category_name = ?',
      [category_name],
    );

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT category_id, category_name, author_id FROM categories',
    );

    return rows;
  }

  async updateCategories(
    category_id: number,
    partial: {
      category_name?: string;
      author_id?: number;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.category_name) {
      fields.push('category_name = ?');
      values.push(partial.category_name);
    }

    if (partial.author_id) {
      fields.push('author_id = ?');
      values.push(partial.author_id);
    }

    if (fields.length === 0) {
      return await this.findById(category_id);
    }

    values.push(category_id);

    const sql = `UPDATE categories SET ${fields.join(', ')} WHERE category_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(category_id);
  }

  async deleteCategories(category_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM categories WHERE category_id = ?',
      [category_id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category deleted successfully',
    };
  }
}
