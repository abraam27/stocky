import * as dotenv from 'dotenv';

dotenv.config();

export class AppConfigs {
  static get appName() {
    return process.env.APP_NAME;
  }

  static get appPort() {
    return (process.env.APP_PORT && parseInt(process.env.APP_PORT)) ?? 8000;
  }

  static get tokenSignature() {
    return process.env.TOKEN_SIGNATURE;
  }

  static get mongoDbUri() {
    const url = process.env.MONGO_URL;
    if (!url) {
      throw new Error('mongodb uri not provided');
    }
    return url;
  }
}
