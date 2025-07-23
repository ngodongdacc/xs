import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as dayjs from 'dayjs';

@Injectable()
export class KetQuaNetService {
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

  async convertData() {
    const startPath = process.cwd() + '/newDay.txt';
    // const startPath = process.cwd() + '/startDay.txt';
    const startDay = await fs.readFile(startPath, 'utf-8');
    let i = 0;
    const data: {
      date: string;
      input: number[];
      output: number[];
    }[] = [];
    let endDay: string = '';
    const limit = 1;
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    while (i < limit) {
      const day = dayjs(startDay)
        .subtract(i + 1, 'day') // hoặc 'days' đều được
        .format('DD-MM-YYYY');

      const dayYes = dayjs(startDay)
        .subtract(i + 2, 'day') // hoặc 'days' đều được
        .format('DD-MM-YYYY');

      const [result, yesResult] = await Promise.all([
        this.getResultDate(day),
        this.getResultDate(dayYes),
      ]);

      if (result && yesResult) {
        const arrResultYes = new Array(100).fill(0);
        const arrResult = new Array(100).fill(0);
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
        endDay = dayjs(startDay)
          .subtract(i + 1, 'day')
          .format('YYYY-MM-DD');
        data.push({
          date: day,
          input: arrResultYes as number[],
          output: arrResult as number[],
        });
      } else {
        i = limit;
      }
      console.log(`i:: ${i} --- day: ${endDay}`);
      i++;

      await sleep(1000);
    }
    if (endDay) {
      await fs.writeFile(startPath, endDay, 'utf-8');
      await this.saveResult(data);
    }
    return data;
  }

  async saveResult(
    input: {
      date: string;
      input: number[];
      output: number[];
    }[],
  ) {
    const scriptPath = path.join(__dirname, '..', '..', 'model', 'data.json');
    // Đọc dữ liệu từ file
    const data: string = await fs.readFile(scriptPath, 'utf-8');
    const jsonArray = JSON.parse(data) as {
      date: string;
      input: number[];
      output: number[];
    }[];
    await fs.writeFile(
      scriptPath,
      JSON.stringify([...input, ...jsonArray], null, ''),
      'utf-8',
    );
  }
}
