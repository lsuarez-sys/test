
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RowDataPacket, OkPacket } from 'mysql2';

@Injectable()
export class membersService {
  constructor(private db: DatabaseService) {}

  private pool = () => this.db.getPool();

  // Create member
  async createMember(
    first_name: string,
    last_name: string,
    email: string | null,
    contact_number: number,
  ) {
    const [result] = await this.pool().execute<OkPacket>(
      'INSERT INTO members (first_name, last_name, email, contact_number) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, contact_number],
    );

    return {
      member_id: result.insertId,
      first_name,
      last_name,
      email,
      contact_number,
    };
  }

  // Find member by ID
  async findById(member_id: number) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT member_id, first_name, last_name, email, contact_number FROM members WHERE member_id = ?',
      [member_id],
    );

    if (rows.length === 0) {
      throw new NotFoundException('Member not found');
    }

    return rows[0];
  }

  // Find member by email
  async findByEmail(email: string) {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT member_id, first_name, last_name, email, contact_number FROM members WHERE email = ?',
      [email],
    );

    return rows[0];
  }

  // Get all members
  async getAll() {
    const [rows] = await this.pool().execute<RowDataPacket[]>(
      'SELECT member_id, first_name, last_name, email, contact_number FROM members',
    );

    return rows;
  }

  // Update member
  async updateMember(
    member_id: number,
    partial: {
      first_name?: string;
      last_name?: string;
      email?: string | null;
      contact_number?: number;
    },
  ) {
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (partial.first_name !== undefined) {
      fields.push('first_name = ?');
      values.push(partial.first_name);
    }

    if (partial.last_name !== undefined) {
      fields.push('last_name = ?');
      values.push(partial.last_name);
    }

    if (partial.email !== undefined) {
      fields.push('email = ?');
      values.push(partial.email);
    }

    if (partial.contact_number !== undefined) {
      fields.push('contact_number = ?');
      values.push(partial.contact_number);
    }

    if (fields.length === 0) {
      return this.findById(member_id);
    }

    values.push(member_id);

    const sql = `UPDATE members SET ${fields.join(', ')} WHERE member_id = ?`;

    const [result] = await this.pool().execute<OkPacket>(sql, values);

    if (result.affectedRows === 0) {
      return this.findById(member_id);
    }

    return this.findById(member_id);
  }

  // Delete member
  async deleteMember(member_id: number) {
    const [result] = await this.pool().execute<OkPacket>(
      'DELETE FROM members WHERE member_id = ?',
      [member_id],
    );

    if (result.affectedRows === 0) {
      throw new NotFoundException('Member not found');
    }

    return {
      message: 'Member deleted successfully',
    };
  }
}
