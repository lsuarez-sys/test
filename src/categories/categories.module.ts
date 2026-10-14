import { Module } from '@nestjs/common';
import { categoriesService } from './categories.service';
import { categoriesController } from './categories.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [
    DatabaseModule,
  ],

  controllers: [categoriesController],
  providers: [categoriesService],
  exports: [categoriesService],
})
export class categoriesModule {}