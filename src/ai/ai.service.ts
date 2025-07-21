import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
interface PredictionResult {
  probabilities: number[];
  top3: number[];
}

@Injectable()
export class AiService {
  async predict(input: number[]) {
    if (input.length !== 27) {
      throw new Error('Input must contain exactly 27 numbers.');
    }

    const scriptPath = path.join(__dirname, '..', '..', 'model', 'predict.py');
    console.log('scriptPath:: ', scriptPath);
    return new Promise((resolve, reject) => {
      const python = spawn('python3', [scriptPath], {
        stdio: ['pipe', 'pipe', 'inherit'],
      });

      python.stdin.write(JSON.stringify(input));
      python.stdin.end();

      let output = '';
      python.stdout.on('data', (data) => {
        console.error(`PYTHON ERROR: ${data}`);
        output += data;
      });

      python.on('close', () => {
        try {
          if (!output.trim()) {
            throw new Error('Python script returned empty output');
          }
          const result: PredictionResult = JSON.parse(
            output,
          ) as PredictionResult;
          //   const probs: number[] = result;
          //   console.log('probs:: ', probs);
          //   const top3 = probs
          //     .map((p, idx) => ({ number: idx + 1, prob: p }))
          //     .sort((a, b) => b.prob - a.prob)
          //     .slice(0, 3);

          resolve(result);
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  }
}
