import { Module } from '@nestjs/common';
import { KetQuaNetService } from './ket-qua-net.service';
import { HttpModule } from '@nestjs/axios';
import { KetQuaNetController } from './ket-qua-net.controller';

@Module({
  imports: [HttpModule],
  controllers: [KetQuaNetController],
  providers: [KetQuaNetService],
})
export class KetQuaNetModule {}
