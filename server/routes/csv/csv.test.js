import axios from 'axios';
import faker from 'faker';
import nock from 'nock';
// import csvSync from 'csv/lib/sync';

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

describe('/api/csv', () => {
  describe('GET', () => {
    describe('When the city exists', () => {
      test('Then returns a 200 status code and a csv for specific city', async () => {
        /** Arrange */
        const body = {
          idSourceName: faker.address.cityName(),
          common: faker.animal.dog(),
          scientific: faker.animal.cat(),
          species: faker.animal.cat(),
          city: faker.address.cityName(),
          datePlanted: new Date(),
          lat: Number(faker.address.latitude()),
          lng: Number(faker.address.longitude()),
        };

        const {
          data: { city },
        } = await axiosAPIClient.post('/trees', body);

        const cityName = city.toLowerCase().replaceAll(' ', '_');
        /** Act */
        const params = {
          city,
        };

        const response = await axiosAPIClient.get('/csv', {
          params,
        });

        /** Assert */
        expect(response.status).toBe(200);
        expect(response.headers['content-disposition']).toBe(
          `attachment; filename="${cityName}.csv"`,
        );
        expect(response.headers['content-type']).toBe(
          'text/csv; charset=UTF-8',
        );
        expect(response.headers['content-length']).toBe('0');
      });
    });

    describe('When the city does not exist', () => {
      test('Then returns a 404 status code', async () => {
        /** Arrange */
        const city = faker.address.cityName();
        /** Act */
        const params = {
          city,
        };

        const response = await axiosAPIClient.get('/csv', {
          params,
        });
        /** Assert */
        expect(response.status).toBe(404);
      });
    });

    describe('When no city is sent in query', () => {
      test('Then returns a 200 and rest of cities', async () => {
        /** Arrange */

        /** Act */
        const response = await axiosAPIClient.get('/csv');

        /** Assert */
        expect(response.status).toBe(200);
        expect(response.headers['content-disposition']).toBe(
          `attachment; filename="all-cities.csv"`,
        );
        expect(response.headers['content-type']).toBe(
          'text/csv; charset=UTF-8',
        );
      });
    });
  });
});
