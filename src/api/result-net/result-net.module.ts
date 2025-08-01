import { Module } from '@nestjs/common';
import { ResultNetService } from './result-net.service';
import { HttpModule } from '@nestjs/axios';
import { ResultNetController } from './result-net.controller';

@Module({
  imports: [HttpModule],
  controllers: [ResultNetController],
  providers: [ResultNetService],
})
export class ResultNetModule {}
