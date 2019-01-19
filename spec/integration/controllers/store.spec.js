import _ from 'lodash';
import Promise from 'bluebird';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { logger, config } from '../../utils';
import ApiFactory  from '../../../src/api';

const { expect } = chai;

chai.use(chaiHttp);

describe('Store controller', () => {
  const server = ApiFactory(config, logger);

  after(async () => {
    const { pg } = server.get('services')
    pg.end();
  })

  it('should GET an error when encryption key is not provided', async () => {
    const res = await chai.request(server)
      .get('/store/id')
      .type("json")

    expect(res.body).to.deep.equal({
      status: 400,
      statusText: 'Bad Request',
      errors: [{
        field: ['encryption-key'],
        location: 'headers',
        messages: ['"encryption-key" is required'],
        types: ['any.required']
      }]
    })
  });

  it('should GET an empty array when decrypting unknown key', async () => {
    const res = await chai.request(server)
      .get('/store/unknown-key')
      .set('encryption-key', 'secretKey')
      .type('json')

    expect(res.body).to.deep.equal([])
  });

  it('should POST a new key-value', async () => {
    const value = {
      is: true,
      size: 123,
      name: 'Fiji',
    };

    const res = await chai.request(server)
      .post('/store/key-1')
      .send(value)
      .set('encryption-key', 'secretKey')
      .type('json');

    expect(res.body).to.deep.equal({
      id: 'key-1'
    });
  });

  it('should set and get multiple items', async () => {
    const encryptionKey = 'secretKey'
    const values = [
      {
        id: 123,
        isIsland: true,
        name: 'Fiji',
      },
      {
        id: 456,
        isIsland: false,
        name: 'Spain',
      }
    ];

    const insertionKeys = await Promise.map(values, async (value, index) => {
      const res = await chai.request(server)
        .post(`/store/key-${index}`)
        .send(value)
        .set('encryption-key', encryptionKey)
        .type('json');

      return res.body;
    });

    expect(insertionKeys).to.deep.equal([
      {
        id: 'key-0'
      },
      {
        id: 'key-1'
      }
    ])

    const fetchRes = await chai.request(server)
      .get(`/store/key-*`)
      .set('encryption-key', encryptionKey)
      .type('json');

    expect(_.sortBy(fetchRes.body, 'id')).to.deep.equal(values)
  });
});
