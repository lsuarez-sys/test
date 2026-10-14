
import { Module } from '@nestjs/common';
import { membersService } from './members.service';
import { membersController } from './members.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    DatabaseModule,
  ],
  controllers: [membersController],
  providers: [membersService],
  exports: [membersService],
})
export class membersModule {}
