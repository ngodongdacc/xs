import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as dayjs from 'dayjs';
import { DAY_FORMAT_DD_MM_YYY_CONSTANT } from 'src/common';
import { SummaryDataResultNetDto } from './dto/summary-data-result-net.dto';

// Kích hoạt plugin

@Injectable()
export class ResultNetService {
  constructor(private readonly httpService: HttpService) {}

  getResultDate(day: string): Promise<number[]> {
    const result = this.httpService
      .get('https://mketqua.net/xo-so.php', {
        params: {
          ngay: day,
        },
      })
      .pipe(
        map((response: AxiosResponse<any>) => {
          const tdValues: number[] = [];
          const $ = cheerio.load(response?.data as string);
          $('#loto_mb td.chu17').each((_, td) => {
            const value = $(td).text().trim();
            if (value) {
              tdValues.push(+value);
            }
          });
          return tdValues;
        }),
      );
    return firstValueFrom(result);
  }

  async summaryData(body: SummaryDataResultNetDto) {
    const { startDay, limit = 1 } = body;
    let i = 0;
    const data: {
      date: string;
      input: number[];
      output: number[];
    }[] = [];

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    while (i < limit) {
      const startDayFormat = startDay.split('-').reverse().join('-');
      const day = dayjs(startDayFormat)
        .subtract(i, 'day') // hoặc 'days' đều được
        .format(DAY_FORMAT_DD_MM_YYY_CONSTANT);

      const dayYes = dayjs(startDayFormat)
        .subtract(i + 1, 'day') // hoặc 'days' đều được
        .format(DAY_FORMAT_DD_MM_YYY_CONSTANT);

      const [result, yesResult] = await Promise.all([
        this.getResultDate(day),
        this.getResultDate(dayYes),
      ]);

      if (result && yesResult) {
        const arrResult = new Array(100).fill(0);
        const arrResultYes = new Array(100).fill(0);

        for (const num of result) {
          if (num >= 0 && num < 100) {
            arrResult[num] = 1;
          }
        }

        for (const num of yesResult) {
          if (num >= 0 && num < 100) {
            arrResultYes[num] = 1;
          }
        }

        data.push({
          date: day,
          input: arrResultYes as number[],
          output: arrResult as number[],
        });
      } else {
        i = limit;
      }
      console.log(`i:: ${i} --- day: ${day}`);
      i++;

      await sleep(1000);
    }
    await this.saveResult(data);
    return data;
  }

  async saveResult(
    input: {
      date: string;
      input: number[];
      output: number[];
    }[],
  ) {
    const scriptPath = process.cwd() + '/model/data-6.json';
    // Đọc dữ liệu từ file
    const data: string = await fs.readFile(scriptPath, 'utf-8');
    const jsonArray = JSON.parse(data) as {
      date: string;
      input: number[];
      output: number[];
    }[];
    const dataJson = [...input, ...jsonArray];
    dataJson.pop();
    await fs.writeFile(scriptPath, JSON.stringify(dataJson, null, ''), 'utf-8');
  }
}
