import express from 'express';
import packageJson from '../../package.json';

class CommonRouter {
  getRoutes () {
    const router = express.Router();

    router.get('/', (req, res) => res.send(packageJson.name));
    router.get('/version', (req, res) => res.send(packageJson.version));
    router.get('/ping', (req, res) => res.send('pong'));

    return router;
  }
}

export default ['/', CommonRouter];