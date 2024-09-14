import { config as dotenvConfig } from 'dotenv';

export class Config {
  constructor() {
    const { error } = dotenvConfig();

    if (error) {
      throw new Error(
        "Can't read .env file. Perhaps the file does not exists.",
      );
    }
  }

  get port() {
    return Number.parseInt(process.env.PORT || '3000', 10);
  }

  get hostName() {
    return process.env.HOST_NAME || 'http://localhost';
  }
}
