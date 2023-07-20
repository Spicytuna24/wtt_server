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

describe('/api/users', () => {
  describe('GET', () => {
    describe('When given an existing user', () => {
      test('Then return the user', async () => {
        /** Arrange */
        const newUserData = {
          nickname: faker.internet.userName(),
          name: faker.name.findName(),
          picture: faker.random.image(),
          email: faker.internet.email(),
        };

        const newUser = await axiosAPIClient.post('/users', newUserData);

        /** Act */
        const params = { email: newUser.data.email };

        const user = await axiosAPIClient.get('/users', {
          params,
        });

        /** Assert */
        expect(user).toMatchObject({
          status: 200,
          data: {
            nickname: newUser.data.nickname,
            name: newUser.data.name,
            email: newUser.data.email,
            idUser: expect.any(Number),
          },
        });
      });
    });

    describe('When given a non-existent user', () => {
      test('Then return a 404 error', async () => {
        /** Act */
        const params = { email: faker.internet.email() };

        const user = await axiosAPIClient.get('/users', { params });

        /** Assert */
        expect(user).toMatchObject({
          status: 404,
          data: {
            error: 'Failed to find user.',
          },
        });
      });
    });
  });

  describe('POST', () => {
    describe('When given a new user', () => {
      test('Then add the user to the database', async () => {
        /** Arrange */
        const newUserData = {
          nickname: faker.internet.userName(),
          name: faker.name.findName(),
          picture: faker.random.image(),
          email: faker.internet.email(),
        };

        /** Act */
        const user = await axiosAPIClient.post('/users', newUserData);

        /** Assert */
        expect(user).toMatchObject({
          status: 201,
          data: {
            nickname: newUserData.nickname,
            name: newUserData.name,
            email: newUserData.email,
            idUser: expect.any(Number),
          },
        });
      });
    });

    describe('When given an existing user', () => {
      test('Then return the existing user', async () => {
        /** Arrange */
        const newUserData = {
          nickname: faker.internet.userName(),
          name: faker.name.findName(),
          picture: faker.random.image(),
          email: faker.internet.email(),
        };

        const newUser = await axiosAPIClient.post('/users', newUserData);

        /** Act */
        const params = { email: newUser.data.email };

        const user = await axiosAPIClient.get('/users', { params });

        /** Assert */
        expect(user).toMatchObject({
          status: 200,
          data: {
            nickname: newUser.data.nickname,
            name: newUser.data.name,
            email: newUser.data.email,
            idUser: newUser.data.idUser,
          },
        });
      });
    });
  });
});
