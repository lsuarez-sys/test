import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { authorModule } from './author/author.module';
import { categoriesModule } from './categories/categories.module';
import { bookModule } from './book/book.module';
import { membersModule } from './members/members.module';
import { borrowModule } from './borrow/borrow.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    authorModule,
    categoriesModule,
    bookModule,
    membersModule,
    borrowModule,
  ],
})
export class AppModule {}