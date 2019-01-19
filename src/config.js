/**
 * This file loads configuration from several sources.
 * It works only for synchronous loading and shoudl be refactored
 * if we want to fetch config from some remote sources
 */
import _ from 'lodash';
import path from 'path';
import * as constants from './constants';
import defaultConfig from '../config/default.json';

/**
 * Default configuration
 */
const env = process.env.NODE_ENV || 'prod';

/**
 * File configuration
 */
const configSuffix = 'env.json';
const fileConfigPath = path.join(__dirname, '../config/', `${env}.${configSuffix}`);

let fileConfig = { env };
try {
  fileConfig = {
    ...fileConfig,
    ...require(fileConfigPath)
  };
} catch (e) {
  // env config file does not exist or has an invalid structure
  if (e.toString().includes('Unexpected token'))
    throw new Error(
      `Config file "${fileConfigPath}" contains an invalid JSON structure: ${e.toString()}`
    );
}

/**
 * Environment configuration
 */
const envConfig = {};

for (const [key, path] of Object.entries(constants.ENV_VARIABLES_MAP)) {
  if (!_.isUndefined(process.env[key]) && process.env[key] !== '')
    _.set(envConfig, path, process.env[key]);
}

const finalConfig = _.defaultsDeep(envConfig, fileConfig, defaultConfig);

// sanitize port number
finalConfig.port = parseInt(finalConfig.port, 10);
export default finalConfig;
