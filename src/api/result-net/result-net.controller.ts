import { Body, Controller, Get, Put } from '@nestjs/common';
import { ResultNetService } from './result-net.service';
import { SummaryDataResultNetDto } from './dto/summary-data-result-net.dto';

@Controller()
export class ResultNetController {
  constructor(private readonly resultNetService: ResultNetService) {}

  @Get()
  getResultDay() {
    return this.resultNetService.getResultDate('19-07-2025');
  }

  @Put('summary-data')
  async convertDatas(@Body() body: SummaryDataResultNetDto) {
    await this.resultNetService.summaryData(body);
    return body;
  }
}
