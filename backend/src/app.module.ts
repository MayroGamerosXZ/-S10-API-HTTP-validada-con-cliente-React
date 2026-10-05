import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AnimeModule } from './anime/anime.module.js';

@Module({
  imports: [AnimeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
