import _ from 'lodash';
import express from 'express';
import requireDir from 'require-dir';
import bodyParser from 'body-parser';
import apiRoutes from './routes';
import util from 'util'

util.inspect.defaultOptions.depth = null

function connectServices (config, logger) {
	// require all services from services dir
	const serviceModules = requireDir('./services');

	// create service objects
	return _.mapValues(serviceModules, (service, name) => {
		if (!service.default)
			return;
		logger.trace('Building service "%s"', name);
		return new service.default(config, logger);
	});
}

function connectRoutes (api, routes, logger) {
	Object.entries(routes).map(([name, route]) => {
		const [prefix, router] = route;

		logger.trace('Deploying "%s" with route prefix "%s"', name, prefix);
		const routerModule = new router(api);
		api.use(prefix, routerModule.getRoutes());

		return routerModule;
	});
}

export default function ApiFactory (config, logger) {
	const api = express();

  // Register API middlewares
  api.use(bodyParser.json({ type: 'application/json'}));
	api.use(logger.expressMiddleware);

  // Register common properties
	api.set('port', config.port);
	api.set('config', config);
	api.set('logger', logger);

	// Register services
	api.set('services', connectServices(config, logger));

	// Register API routes
	connectRoutes(api, apiRoutes, logger);

  api.use((error, req, res, next) => {
  	logger.error('Error while processing request:', {
  		request: {
  			path: req.originalUrl,
  			clientIp: req.ip,
      },
			responseError: error
		})
		res.status(400).json(
			_.isString(error) ? { error } : error
		);
  });

  return api;
}