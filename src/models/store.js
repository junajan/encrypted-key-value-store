import Promise from 'bluebird';
import * as constants from '../constants';
import * as crypto from '../services/crypto';

export class StoreModel{
	constructor (app) {
		this.db = app.get('services').pg;
		this.logger = app.get('logger');

		this.DB_TABLE = 'store';
	}

	_keyToDbFormat (key) {
		return key.replace(/\*/g, '%');
	}

	async _getSalt () {
		return crypto.randomString(constants.SALT_LENGTH);
	}

	async get (key, secret) {
		key = this._keyToDbFormat(key);

		// fetch items from DB:
		const items = await this.db.query(
			`SELECT key, value, salt FROM "${this.DB_TABLE}" WHERE key LIKE $1`,
			key
		);

		// decrypt items
		return Promise.map(items, async (item) => {
			try {

				const decrypted = await crypto.decrypt(secret, item.value, item.salt);
				return JSON.parse(decrypted)
			} catch (err) {

				const errorMessage = `An error occurred while decrypting key "${item.key}"`;
				this.logger.error(errorMessage, err);
				return Promise.reject(errorMessage);
			}
		}, { concurrency: 50 });
	}

	async set (key, secret, value) {
		// create salt
		const salt = await this._getSalt();
		value = JSON.stringify(value)
		// encrypt value
		value = await crypto.encrypt(secret, value, salt);

		const item = {
			key,
			value,
			salt
		};

		// save encrypted value to DB
		return this.db.upsert(this.DB_TABLE, item, 'key');
	}
}

let x = null;
export default (...args) => {
	if(!x) x = new StoreModel(...args);
	return x;
};
