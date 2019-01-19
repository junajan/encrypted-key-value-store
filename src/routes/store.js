import express from 'express';
import validate from 'express-validation';
import storeControllerSingleton from '../controllers/store';
import * as validators from '../validators/store';

class StoreRouter {
	constructor (app) {
		this.app = app;
		this.config = this.app.get('config');

		this.controller = storeControllerSingleton(app);
	}

	getRoutes () {
		const router = express.Router();

		router.get(
			'/:id',
			validate(validators.getItem),
			this.controller.get.bind(this.controller)
		);

		router.post(
			'/:id',
			validate(validators.setItem),
			this.controller.set.bind(this.controller)
		);

		return router;
	}
}

export default ['/store', StoreRouter];