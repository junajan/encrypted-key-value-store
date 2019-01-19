import chai from 'chai';
import chaiHttp from 'chai-http';
import { logger, config } from '../../utils';
import { name, version }  from '../../../package';
import ApiFactory  from '../../../src/api';

const { expect } = chai;

chai.use(chaiHttp);

describe('Common routes', () => {
  let server;

  before(() => {
    server = ApiFactory(config, logger);
  });

  it('it should GET /', async () => {
    const res = await chai.request(server)
      .get('/');

    expect(res.text).to.equal(name);
  });

  it('it should GET /version', async () => {
    const res = await chai.request(server)
      .get('/version');

    expect(res.text).to.equal(version);
  });

  it('it should GET /ping', async () => {
    const res = await chai.request(server)
      .get('/ping');

    expect(res.text).to.equal('pong');
  });
});