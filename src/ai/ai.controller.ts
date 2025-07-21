import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('predict')
  async predict(@Body('data') data: number[]) {
    return this.aiService.predict(data);
  }
}
