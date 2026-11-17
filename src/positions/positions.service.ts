import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // 1. CREATE
  async create(createPositionDto: CreatePositionDto) {
    const { position_code, position_name, created_at } = createPositionDto as any;
    const pool = this.databaseService.getPool();
    
    const [result]: any = await pool.execute(
      'INSERT INTO positions (position_code, position_name, created_at) VALUES (?, ?, ?)',
      [position_code, position_name, created_at || new Date()]
    );

    return {
      id: result.insertId,
      ...createPositionDto,
    };
  }

  // 2. READ ALL
  async findAll() {
    const pool = this.databaseService.getPool();
    const [rows] = await pool.query('SELECT * FROM positions');
    return rows;
  }

  // 3. READ ONE
  async findOne(id: number) {
    const pool = this.databaseService.getPool();
    const [rows]: any = await pool.query('SELECT * FROM positions WHERE id = ?', [id]);
    
    if (!rows || rows.length === 0) {
      throw new NotFoundException(`Position with ID ${id} not found`);
    }
    return rows[0];
  }

  // 4. UPDATE
  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const pool = this.databaseService.getPool();
    await this.findOne(id); // Ensures it exists

    const fields = Object.keys(updatePositionDto);
    const values = Object.values(updatePositionDto);

    if (fields.length === 0) {
      return this.findOne(id);
    }

    const setClause = fields.map((field) => `${field} = ?`).join(', ');
    await pool.execute(
      `UPDATE positions SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    return this.findOne(id);
  }

  // 5. DELETE
  async remove(id: number) {
    const pool = this.databaseService.getPool();
    await this.findOne(id); // Ensures it exists
    
    await pool.execute('DELETE FROM positions WHERE id = ?', [id]);
    return { message: `Position with ID ${id} successfully deleted` };
  }
}