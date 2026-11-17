import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity'; // or your model/schema import
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
public class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  // 1. CREATE - This replaces "This action adds a new position"
  async create(createPositionDto: CreatePositionDto) {
    const newPosition = this.positionsRepository.create(createPositionDto);
    return await this.positionsRepository.save(newPosition);
  }

  // 2. READ ALL - This replaces "This action returns all positions"
  async findAll() {
    return await this.positionsRepository.find();
  }

  // 3. READ ONE
  async findOne(id: number) {
    return await this.positionsRepository.findOneBy({ id });
  }

  // 4. UPDATE
  async update(id: number, updatePositionDto: UpdatePositionDto) {
    await this.positionsRepository.update(id, updatePositionDto);
    return this.findOne(id);
  }

  // 5. DELETE
  async remove(id: number) {
    return await this.positionsRepository.delete(id);
  }
}