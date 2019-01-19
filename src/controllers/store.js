import StoreModel from '../models/store';

class StoreController {
  constructor (app) {
    this.app = app;
    this.model = StoreModel(app, app.get('config'));
  }

  async get (req, res, next) {
    const { id } = req.params;
    const secret = req.headers['encryption-key'];

    try {
      const decryptedItems = await this.model.get(id, secret);
      return res.json(decryptedItems);
    } catch (e) {
      return next(e);
    }
  }

  async set (req, res, next) {
    const { id } = req.params;
    const secret = req.headers['encryption-key'];
    const value = req.body;

    try {
      const insertedId = await this.model.set(id, secret, value);
      res.json({ id: insertedId });
    } catch (e) {
      return next(e);
    }
  }
}

let x = null;
export default (...args) => {
  if (!x) x = new StoreController(...args);
  return x;
};
