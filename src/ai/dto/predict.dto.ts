import { ApiProperty } from '@nestjs/swagger';

export class PredictDto {
  @ApiProperty({
    type: [Number],
  })
  data: number[];
}
