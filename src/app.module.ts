import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';

@Module({
  imports: [],
  controllers: [AppController, AiController],
  providers: [AppService, AiService],
})
export class AppModule {}
