import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

process.env.MONGOMS_LAUNCH_TIMEOUT_MS = '120000';
process.env.MONGOMS_DOWNLOAD_TIMEOUT_MS = '300000';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const loadEnv = () => {
  const possiblePaths = [
    path.join(__dirname, '..', '.env'),
    path.join(process.cwd(), 'backend', '.env'),
    path.join(process.cwd(), '.env')
  ];

  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const firstEqualIndex = trimmed.indexOf('=');
          if (firstEqualIndex > -1) {
            const key = trimmed.substring(0, firstEqualIndex).trim();
            const value = trimmed.substring(firstEqualIndex + 1).trim();
            if (key && !process.env[key]) {
              process.env[key] = value.replace(/^["']|["']$/g, '');
            }
          }
        }
      });
      break;
    }
  }
};

loadEnv();
