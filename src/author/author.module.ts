import { Module } from '@nestjs/common';
import { authorService } from './author.service';
import { authorController } from './author.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],

  controllers: [authorController],
  providers: [authorService],
  exports: [authorService],
})
export class authorModule {}