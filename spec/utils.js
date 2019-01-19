import loggerSingleton from '../src/services/logger';
import testConfig from '../src/config';

export const logger = loggerSingleton({ logLevel: 'debug' });
export const config = testConfig
