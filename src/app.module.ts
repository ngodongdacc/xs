import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { RouterModule } from '@nestjs/core';
import { KetQuaNetModule } from './ket-qua-net/ketQuaNet.module';

@Module({
  imports: [
    KetQuaNetModule,
    RouterModule.register([
      {
        path: 'ket-qua-net',
        module: KetQuaNetModule,
      },
    ]),
  ],
  controllers: [AppController, AiController],
  providers: [AppService, AiService],
})
export class AppModule {}
