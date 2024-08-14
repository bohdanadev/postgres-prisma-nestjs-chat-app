import * as dotenv from 'dotenv';

import configuration from './configs';
import { Config } from './configs.type';

class ConfigStatic {
  public get(): Config {
    return configuration();
  }
}

const environment = process.env.APP_ENVIRONMENT || 'local';
dotenv.config({ path: `environments/${environment}.env` });
const ConfigStaticService = new ConfigStatic();
export { ConfigStaticService };
