import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';

@Injectable()
export class AiService {
  async predict(input: number[]) {
    const scriptPath = path.join(__dirname, '..', '..', 'model', 'predict.py');
    const pythonPath = path.join(
      __dirname,
      '..',
      '..',
      'venv',
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
          if (!output) {
            throw new Error('Python script returned empty output');
          }
          resolve(output);
        } catch (err) {
          reject(err instanceof Error ? err : new Error(String(err)));
        }
      });
    });
  }
}
