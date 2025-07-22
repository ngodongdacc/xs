import { Controller, Get } from '@nestjs/common';
import { KetQuaNetService } from './ket-qua-net.service';

@Controller()
export class KetQuaNetController {
  constructor(private readonly ketQuaNetService: KetQuaNetService) {}

  @Get()
  getResultDay() {
    return this.ketQuaNetService.getResultDate('19-07-2025');
  }

  @Get('convert-data')
  convertDatas() {
    this.ketQuaNetService.convertData();
    return true;
  }
}
