import axios from 'axios';
import faker from 'faker';
import nock from 'nock';

let axiosAPIClient;

beforeAll(() => {
  const port = '3002';
  const axiosConfig = {
    baseURL: `http://127.0.0.1:${port}/api`,
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

describe('/api/sources', () => {
  /** Arrange */
  const mockBody = () => {
    const idSourceName = faker.name.findName();
    const body = {
      crosswalk: {
        idSourceName,
        address: 'address',
        age: 'age',
        audited: 'audited',
        city: 'city',
        class: 'class',
        common: 'common',
        cost: 'cost',
        count: 'count',
        country: 'country',
        crown: 'crown',
        crownMax: 'crownMax',
        crownMin: 'crownMin',
        dbh: 'dbh',
        dbhMax: 'dbhMax',
        dbhMin: 'dbhMin',
        email: 'email',
        family: 'family',
        genus: 'genus',
        health: 'health',
        height: 'height',
        heightMax: 'heightMax',
        heightMin: 'heightMin',
        idReference: 'idReference',
        irrigation: 'irrigation',
        latitude: 'latitude',
        longitude: 'longitude',
        location: 'location',
        neighborhood: 'neighborhood',
        note: 'note',
        notes: 'notes',
        owner: 'owner',
        planted: 'planted',
        scientific: 'scientific',
        species: 'species',
        spread: 'spread',
        state: 'state',
        status: 'status',
        structure: 'structure',
        trunks: 'trunks',
        ule: 'ule',
        uleMax: 'uleMax',
        uleMin: 'uleMin',
        updated: 'updated',
        url: 'url',
        urlimage: 'urlimage',
        variety: 'variety',
        volunteer: 'volunteer',
        zip: 'zip',
      },
      source: {
        idSourceName,
        broken: false,
        city: faker.address.cityName(),
        contact: faker.name.findName(),
        country: faker.address.country(),
        download: faker.internet.url(),
        email: faker.internet.email(),
        filename: faker.system.fileName(),
        format: faker.system.commonFileName(),
        info: faker.internet.url(),
        isoAlpha3: faker.address.countryCode('alpha-3'),
        latitude: Number(faker.address.latitude()),
        license: faker.name.findName(),
        longitude: Number(faker.address.longitude()),
        notes: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        state: faker.address.stateAbbr(),
      },
    };
    return body;
  };

  describe('POST', () => {
    describe('Post a source and crosswalk', () => {
      test('Then confirm the source and crosswalk are returned', async () => {
        /** Arrange */
        const body = mockBody();
        /** Act */

        const { data, status } = await axiosAPIClient.post('/sources', body);

        const dataObj = {
          source: { idSourceName: body.source.idSourceName },
          crosswalk: { idSourceName: body.source.idSourceName },
        };

        /** Assert */
        expect(status).toBe(200);
        expect(data).toMatchObject(dataObj);
      });
    });
  });

  describe('GET', () => {
    describe('When sources is specified by idSourceName', () => {
      test('Then confirm one source is returned', async () => {
        /** Arrange */
        const body = mockBody();
        /** Act */
        const { data } = await axiosAPIClient.post('/sources', body);
        /** Act */
        const params = { idSourceName: data?.source?.idSourceName };
        const response = await axiosAPIClient.get('/sources', {
          params,
        });

        /** Assert */
        expect(response?.status).toBe(200);
        expect(response?.data).toMatchObject(body);
      });
      test('Then confirm the source contains source and crosswalk keys', async () => {
        /** Arrange */
        const body = mockBody();
        const expected = ['source', 'crosswalk'];
        /** Act */
        const { data } = await axiosAPIClient.post('/sources', body);
        /** Act */
        const params = { idSourceName: data?.source?.idSourceName };
        const response = await axiosAPIClient.get('/sources', {
          params,
        });

        /** Assert */
        expect(response?.status).toBe(200);
        expect(Object.keys(response?.data)).toEqual(
          expect.arrayContaining(expected),
        );
      });
    });
    describe(`When sources is specified by 'All'`, () => {
      test('Then confirm sources are returned in Array', async () => {
        /** Arrange */
        const body = mockBody();
        const body2 = mockBody();
        // const bodyArray = [body, body2];
        /** Act */
        await axiosAPIClient.post('/sources', body);
        await axiosAPIClient.post('/sources', body2);
        /** Act */
        const params = { sources: 'All' };
        const response = await axiosAPIClient.get('/sources', {
          params,
        });
        /** Assert */
        expect(response?.status).toBe(200);
        expect(response?.data.length).toBeGreaterThan(1);
        // Add this back in once we have a blank slate test database
        // expect(response?.data).toMatchObject(bodyArray);
      });
    });
  });

  describe('PUT', () => {
    describe('When source is specified by idSourceName, PUT new values into record', () => {
      test('Then confirm the source is returned', async () => {
        /** Arrange */
        const body = mockBody();

        /** Act */
        const responsePost = await axiosAPIClient.post('/sources', body);
        /** Act */
        const params = {
          idSourceName: await responsePost?.data?.source?.idSourceName,
        };
        const responseGet = await axiosAPIClient.get('/sources', {
          params,
        });

        const { idSourceName } = await responseGet.data.source;
        const newBody = {
          source: { idSourceName, broken: true, city: 'ciudad' },
          crosswalk: { idSourceName, address: 'dirección' },
        };
        const { data, status } = await axiosAPIClient.put('/sources', newBody);

        /** Assert */
        expect(status).toBe(200);
        expect(data).toMatchObject(newBody);
      });
    });
  });
});
