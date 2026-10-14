import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class authorService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  async createAuthor(author_name: string, nationality: string) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO author (author_name, nationality) VALUES (?, ?)',
      [author_name, nationality],
    );

    return {
      author_id: result.insertId,
      author_name,
      nationality,
    };
  }

  async findById(author_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT author_id, author_name, nationality FROM author WHERE author_id = ?',
      [author_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Author not found');
    }

    return rows[0];
  }

  async findByName(author_name: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT author_id, author_name, nationality FROM author WHERE author_name = ?',
      [author_name],
    );

    return rows[0];
  }

  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT author_id, author_name, nationality FROM author',
    );

    return rows;
  }

  async updateAuthor(
    author_id: number,
    partial: {
      author_name?: string;
      nationality?: string;
    },
  ) {
    const fields: string[] = [];
    const values: any[] = [];

    if (partial.author_name) {
      fields.push('author_name = ?');
      values.push(partial.author_name);
    }

    if (partial.nationality) {
      fields.push('nationality = ?');
      values.push(partial.nationality);
    }

    if (fields.length === 0) {
      return await this.findById(author_id);
    }

    values.push(author_id);

    const sql = `UPDATE author SET ${fields.join(', ')} WHERE author_id = ?`;

    await this.pool().execute(sql, values);

    return this.findById(author_id);
  }

  async deleteAuthor(author_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM author WHERE author_id = ?',
      [author_id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Author not found');
    }

    return {
      message: 'Author deleted successfully',
    };
  }

  async setRefreshToken(author_id: number, refresh_token: string | null) {
    await this.pool().execute(
      'UPDATE author SET refresh_token = ? WHERE author_id = ?',
      [refresh_token, author_id],
    );

    return { message: 'Refresh token updated successfully' };
  }
}