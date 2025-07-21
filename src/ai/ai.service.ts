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
    const pythonPath = path.join(
      __dirname,
      '..',
      '..',
      'venv310',
      'bin',
      'python',
    );
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
        output += chunk;
      });

      python.on('close', () => {
        try {
          console.log('output:: ', output);
          if (!output) {
            throw new Error('Python script returned empty output');
          }
          resolve(JSON.parse(output));
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  }
}
