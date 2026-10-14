import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class borrowService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create borrow record
  async createBorrow(
    member_id: number,
    book_id: number,
    borrow_date: string,
    return_date: string,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO borrow (member_id, book_id, borrow_date, return_date) VALUES (?, ?, ?, ?)',
      [member_id, book_id, borrow_date, return_date],
    );

    return {
      borrow_id: result.insertId,
      member_id,
      book_id,
      borrow_date,
      return_date,
    };
  }

  // Find borrow record by ID
  async findById(borrow_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT borrow_id, member_id, book_id, borrow_date, return_date FROM borrow WHERE borrow_id = ?',
      [borrow_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Borrow record not found');
    }

    return rows[0];
  }

  // Get all borrow records
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT borrow_id, member_id, book_id, borrow_date, return_date FROM borrow',
    );

    return rows;
  }

  // Update borrow record
  async updateBorrow(
    borrow_id: number,
    partial: {
      member_id?: number;
      book_id?: number;
      borrow_date?: string;
      return_date?: string;
    },
  ) {
    const fields: string[] = [];
    const values: (string | number)[] = [];

    if (partial.member_id !== undefined) {
      fields.push('member_id = ?');
      values.push(partial.member_id);
    }

    if (partial.book_id !== undefined) {
      fields.push('book_id = ?');
      values.push(partial.book_id);
    }

    if (partial.borrow_date !== undefined) {
      fields.push('borrow_date = ?');
      values.push(partial.borrow_date);
    }

    if (partial.return_date !== undefined) {
      fields.push('return_date = ?');
      values.push(partial.return_date);
    }

    if (fields.length === 0) {
      return this.findById(borrow_id);
    }

    values.push(borrow_id);

    const sql = `UPDATE borrow SET ${fields.join(', ')} WHERE borrow_id = ?`;

    await this.pool().execute<OkPacket>(sql, values);

    return this.findById(borrow_id);
  }

  // Delete borrow record
  async deleteBorrow(borrow_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM borrow WHERE borrow_id = ?',
      [borrow_id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Borrow record not found');
    }

    return {
      message: 'Borrow record deleted successfully',
    };
  }
}
