import _ from 'lodash';
// use some other library which offers also a connection pool?
import pgPromise from 'pg-promise';


export default class PostgresClient {
  constructor (config, logger) {
    this.client = null;
    this.logger = logger;
    this.config = config.database;
  }

  _getClient () {
    if (!this.client)
      this.client = pgPromise({})(this.config);
    return this.client;
  }

  _log (type, query, params) {
    this.logger.debug(`PG::Running ${type}:`, query, params);
  }

  _arrayize (val) {
    return _.isArray(val)
      ? val
      : [val];
  }

  end () {
    this.logger.debug('PG::Closing connection');
    return this.client
      ? this.client.$pool.end()
      : null;
  }

  async query (query, params = []) {
    const client = this._getClient();
    params = this._arrayize(params);

    this._log('query', query, params);
    return client.any(query, params);
  }

  async upsert (tableName, data, conflictColumn) {
    const client = this._getClient();
    const columns = Object.keys(data);
    const valueIndexes = Object.values(data).map((val, index) => `$${index + 1}`);
    const values = Object.values(data);

    const query = `
      INSERT INTO "${tableName}" (${columns}) VALUES (
        ${valueIndexes}
      )
      ON CONFLICT (${conflictColumn}) DO UPDATE SET (${columns}) = (${valueIndexes})
      RETURNING ${conflictColumn};
    `;

    this._log('upsert', query, values);
    return client.one(query, values, res => res[conflictColumn]);
  }
}
