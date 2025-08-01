import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import { PredictDto } from './dto/predict.dto';

@Injectable()
export class AiService {
  private resultData: {
    date: string;
    input: number[];
    output: number[];
  }[];

  constructor() {
    this.onInit();
  }

  async onInit() {
    const pathFileResult = process.cwd() + '/model/result.json';
    const data: string = await fs.readFile(pathFileResult, 'utf-8');
    const jsonArray = JSON.parse(data) as {
      date: string;
      input: number[];
      output: number[];
    }[];
    this.resultData = jsonArray;
  }
  async predict(body: PredictDto) {
    const pathFile = process.cwd() + '/model/data-6.json';
    const data6: string = await fs.readFile(pathFile, 'utf-8');
    const data6Json = JSON.parse(data6) as {
      date: string;
      input: number[];
      output: number[];
    }[];

    const input = data6Json[0].output;
    const day = data6Json[0].date;
    const scriptPath = process.cwd() + '/model/predict.py'; // path.join(__dirname, '..', '..', 'model', 'predict.py');
    const pythonPath = process.cwd() + '/venv/bin/python';
    // path.join(
    //   __dirname,
    //   '..',
    //   '..',
    //   'venv',
    //   'bin',
    //   'python',
    // );
    return new Promise((resolve, reject) => {
      const python = spawn(pythonPath, [scriptPath], {
        stdio: ['pipe', 'pipe', 'inherit'],
      });

      python.stdin.write(JSON.stringify(input));
      python.stdin.end();

      let output = '';

      python.stdout.on('data', (data: Buffer) => {
        const chunk = data.toString();
        console.error(`PYTHON ERROR: ${chunk}`);
        output = chunk;
      });

      python.on('close', () => {
        try {
          if (!output) {
            throw new Error('Python script returned empty output');
          }
          console.log('day:: ', day);
          const outputJson = JSON.parse(output) as { indices: number[] };
          const resultDayIndex = this.resultData.findIndex(
            (f) => f.date === day,
          );
          let total = 0;
          if (resultDayIndex >= 0) {
            const resultDay = this.resultData[resultDayIndex - 1];
            const num1 = outputJson.indices[0];
            const num2 = outputJson.indices[1];
            const num3 = outputJson.indices[2];
            const total1 = resultDay.output[num1] ? 68 : -27;
            const total2 = resultDay.output[num2] ? 68 : -27;
            const total3 = resultDay.output[num3] ? 68 : -27;
            console.log(`num1:: ${num1} total1:: ${total1}`);
            console.log(`num2:: ${num2} total2:: ${total2}`);
            console.log(`num3:: ${num3} total3:: ${total3}`);

            total = total1 + total2 + total3;
          }
          resolve({ day, total, outputJson });
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  }
}
