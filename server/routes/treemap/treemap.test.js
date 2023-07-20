import axios from 'axios';
import faker from 'faker';
import nock from 'nock';

let axiosAPIClient;

beforeAll(() => {
  const axiosConfig = {
    baseURL: 'http://127.0.0.1:3002/api',
    validateStatus: () => true,
  };

  axiosAPIClient = axios.create(axiosConfig);

  // Only allow requests to localhost
  nock.disableNetConnect();
  nock.enableNetConnect('127.0.0.1');
});

afterEach(() => {
  // Remove all interceptors
  nock.cleanAll();
});

afterAll(() => {
  // Re-enable requests to all hosts
  nock.enableNetConnect();
});

describe('/api/treemap', () => {
  describe('GET', () => {
    describe('When a new tree is created', () => {
      test('Then the tree cached as GeoJSON', async () => {
        /** Arrange */
        const newTreeData = {
          common: faker.animal.dog(),
          scientific: faker.animal.cat(),
          city: faker.address.cityName(),
          datePlanted: new Date(),
          lat: Number(faker.address.latitude()),
          lng: Number(faker.address.longitude()),
        };

        const newTree = await axiosAPIClient.post('/trees', newTreeData);

        /** Act */
        const params = { city: '%' };

        const { status, data } = await axiosAPIClient.get('/treemap', {
          params,
        });

        const expected = { status, data };

        /** Assert */
        expect(expected).toMatchObject({
          status: 200,
          data: {
            type: 'FeatureCollection',
            features: expect.arrayContaining([
              {
                id: 'treedata',
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [newTree.data.lng, newTree.data.lat],
                },
                properties: {
                  id: Number(newTree.data.id),
                  common: newTree.data.common,
                  health: null,
                },
              },
            ]),
          },
        });
      });
    });
  });
});
