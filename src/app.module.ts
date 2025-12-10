import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // o mysql, mariadb, etc.
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres12345',
      database: 'user_service_db',
      entities: [],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
// me quede aca
