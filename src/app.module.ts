import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiController } from './api/ai/ai.controller';
import { AiService } from './api/ai/ai.service';
import { RouterModule } from '@nestjs/core';
import { ResultNetModule } from './api/result-net/result-net.module';

@Module({
  imports: [
    ResultNetModule,
    RouterModule.register([
      {
        path: 'result-net',
        module: ResultNetModule,
      },
    ]),
  ],
  controllers: [AppController, AiController],
  providers: [AppService, AiService],
})
export class AppModule {}
