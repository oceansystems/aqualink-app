import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('dotenv').config();
} catch {
  // Pass
}

// ormconfig is a CommonJS/AMD style import rather than ES6-style module due to how TypeORM CLI works internally.
// This means we need to use require rather than import, unfortunately.
const dbConfig = require('../../ormconfig');

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value) {
      if (throwOnMissing) {
        throw new Error(`config error - missing env.${key}`);
      } else {
        return '';
      }
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);
    return mode !== 'development';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      ...dbConfig,
    };
  }
}

const configService = new ConfigService(process.env);

export { configService };
