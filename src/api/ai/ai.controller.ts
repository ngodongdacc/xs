import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';
import { PredictDto } from './dto/predict.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict')
  async predict(@Body() body: PredictDto) {
    return this.aiService.predict(body);
  }
}
