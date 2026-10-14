import { Module } from '@nestjs/common';
import { bookService } from './book.service';
import { bookController } from './book.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],

  controllers: [bookController],
  providers: [bookService],
  exports: [bookService],
})
export class bookModule {}