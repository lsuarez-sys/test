
import { Module } from '@nestjs/common';
import { borrowService } from './borrow.service';
import { borrowController } from './borrow.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],

  controllers: [borrowController],
  providers: [borrowService],
  exports: [borrowService],
})
export class borrowModule {}
