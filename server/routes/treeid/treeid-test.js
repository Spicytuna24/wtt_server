import axios from 'axios';
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

describe('/treeid', () => {
  describe('GET', () => {
    describe('When valid tree and valid user', () => {
      describe('When the user has not liked the tree', () => {
        test('Then confirm the user has not liked the tree', async () => {
          /** Arrange */
          const data = [
            [
              'Oakland',
              'California',
              'Dracaena, Giant',
              'Cordyline australis',
              -122.2987539,
              37.80969809,
            ],
            [
              'Oakland',
              'CA',
              'Oak, Coastal/ California Live',
              'Quercus agrifolia',
              -122.2705264,
              37.79770322,
            ],
            [
              'Alameda',
              'CA',
              'MAIDENHAIRTREE',
              'Ginkgobiloba',
              -122.2260514,
              37.75744973,
            ],
            [
              'Alameda',
              'CA',
              'ASPHALTED WELL',
              'Asphalted well',
              -122.2654197,
              37.76083234,
            ],
            [
              'San Francisco',
              'CA',
              'Lemon Bottlebrush',
              'Callistemon citrinus',
              -122.39180689548819,
              37.73816558097692,
            ],
            [
              'San Francisco',
              'CA',
              'Lemon Bottlebrush',
              'Callistemon citrinus',
              -122.39180445292185,
              37.7381657644348,
            ],
          ];

          const ids = data.map(async (d) => {
            /** Act */
            const params = {
              common: d[2],
              scientific: d[3],
              lat: Number(d[5]),
              lng: Number(d[4]),
              city: d[0],
              state: d[1],
            };

            const id = await axiosAPIClient.get('/treelikes', {
              params,
            });
            return id;
          });

          /** Assert */
          const isArrayUnique = (arr) =>
            Array.isArray(arr) && new Set(arr).size === arr.length;
          expect(isArrayUnique(ids)).toBeTruthy();
        });
      });
    });
  });
});
