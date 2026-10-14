import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class bookService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create book
  async createBook(
    book_title: string,
    author_id: number,
    category_id: number,
    year_publish: number,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO book (book_title, author_id, category_id, year_publish) VALUES (?, ?, ?, ?)',
      [book_title, author_id, category_id, year_publish],
    );

    return {
      book_id: result.insertId,
      book_title,
      author_id,
      category_id,
      year_publish,
    };
  }

  // Find book by ID
  async findById(book_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT book_id, book_title, author_id, category_id, year_publish FROM book WHERE book_id = ?',
      [book_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Book not found');
    }

    return rows[0];
  }

  // Get all books
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT book_id, book_title, author_id, category_id, year_publish FROM book',
    );

    return rows;
  }

  // Update book
  async updateBook(
    book_id: number,
    partial: {
      book_title?: string;
      author_id?: number;
      category_id?: number;
      year_publish?: number;
    },
  ) {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (partial.book_title !== undefined) {
      fields.push('book_title = ?');
      values.push(partial.book_title);
    }

    if (partial.author_id !== undefined) {
      fields.push('author_id = ?');
      values.push(partial.author_id);
    }

    if (partial.category_id !== undefined) {
      fields.push('category_id = ?');
      values.push(partial.category_id);
    }

    if (partial.year_publish !== undefined) {
      fields.push('year_publish = ?');
      values.push(partial.year_publish);
    }

    if (fields.length === 0) {
      return this.findById(book_id);
    }

    values.push(book_id);

    const sql = `UPDATE book SET ${fields.join(', ')} WHERE book_id = ?`;

    const [result] = await this.pool().execute<OkPacket>(sql, values);

    if (result.affectedRows === 0) {
      return this.findById(book_id);
    }

    return this.findById(book_id);
  }

  // Delete book
  async deleteBook(book_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM book WHERE book_id = ?',
      [book_id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Book not found');
    }

    return {
      message: 'Book deleted successfully',
    };
  }
}