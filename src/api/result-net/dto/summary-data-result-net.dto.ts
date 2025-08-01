import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import * as dayjs from 'dayjs';
import { DAY_FORMAT_DD_MM_YYY_CONSTANT } from 'src/common';

export class SummaryDataResultNetDto {
  @ApiProperty({
    description: 'Ngày cần lấy',
    example: dayjs().subtract(1, 'day').format(DAY_FORMAT_DD_MM_YYY_CONSTANT),
  })
  @IsNotEmpty()
  startDay: string;

  @ApiProperty({
    description: 'Số  lượng ngày kết thúc',
    example: 1,
  })
  @IsInt()
  limit: number;
}
