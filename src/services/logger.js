import log4js from 'log4js';

let logger = null;
export default function (config) {
  if (logger)
    return logger;

  logger = log4js.getLogger('app');
  logger.level = config.logLevel || 'info';
  logger.expressMiddleware = log4js.connectLogger(logger);
  return logger;
}

