import http from 'http';
import apiFactory from './api';
import loggerSingleton from './services/logger';

export default class App {
  constructor (config) {
    this.logger = loggerSingleton(config);
    this.config = config;

    // Create API(express) and HTTP instances
    this.api = apiFactory(config, this.logger);
    this.server = http.createServer(this.api);

    // Listen on provided port, on all network interfaces.
    this.server.on('error', this._onError.bind(this));
    this.server.on('listening', this._onListening.bind(this));
  }

  /**
   * Event listener for HTTP server "error" event.
   */
  _onError (error) {
    const { port } = this.config;

    if (error.syscall !== 'listen')
      throw error;

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
    case 'EACCES':
      this.logger.error('%s requires elevated privileges', bind);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      this.logger.error('%s is already in use', bind);
      process.exit(1);
      break;
    default:
      throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */
  _onListening () {
    const addr = this.server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    this.logger.info('Listening on %s', bind);
  }

  start () {
    this.server.listen(this.api.get('port'));
  }
}