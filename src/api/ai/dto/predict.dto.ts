import { ApiProperty } from '@nestjs/swagger';

export class PredictDto {
  @ApiProperty()
  day: string;

  @ApiProperty({
    type: [Number],
  })
  input: number[];
}
