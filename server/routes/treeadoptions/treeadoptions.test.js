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

describe('/treesadoptions', () => {
  describe('GET', () => {
    describe('When valid tree and valid user', () => {
      describe('When the user has not adopted the tree', () => {
        test('Then confirm the user has not adopted the tree', async () => {
          /** Arrange */
          const treeData = {
            common: faker.animal.dog(),
            scientific: faker.animal.cat(),
            city: faker.address.cityName(),
            datePlanted: new Date(),
            lat: Number(faker.address.latitude()),
            lng: Number(faker.address.longitude()),
          };

          const tree = await axiosAPIClient.post('/trees', treeData);

          /** Act */
          const params = {
            id: tree.data.id,
            email: faker.internet.email(),
          };

          const treeAdoptions = await axiosAPIClient.get('/treeadoptions', {
            params,
          });

          /** Assert */
          expect(treeAdoptions).toMatchObject({
            status: 200,
            data: {
              adopted: false,
              adoptedCount: 0,
            },
          });
        });
      });

      describe('When the user has adopted the tree', () => {
        test('Then confirm the user has adopted the tree', async () => {
          /** Arrange */
          const treeData = {
            common: faker.animal.dog(),
            scientific: faker.animal.cat(),
            city: faker.address.cityName(),
            datePlanted: new Date(),
            lat: Number(faker.address.latitude()),
            lng: Number(faker.address.longitude()),
          };

          const tree = await axiosAPIClient.post('/trees', treeData);

          const user = {
            email: faker.internet.email(),
            nickname: faker.internet.userName(),
          };

          const newTreeAdoptionData = {
            id: tree.data.id,
            common: tree.data.common,
            email: user.email,
            nickname: user.nickname,
            request: {
              type: 'POST',
            },
          };

          const newTreeAdoption = await axiosAPIClient.post(
            '/treeadoptions',
            newTreeAdoptionData,
          );

          /** Act */
          const params = {
            id: newTreeAdoption.data.id,
            email: user.email,
          };

          const treeAdoption = await axiosAPIClient.get('/treeadoptions', {
            params,
          });

          /** Assert */
          expect(treeAdoption).toMatchObject({
            status: 200,
            data: {
              adopted: true,
              adoptedCount: 1,
            },
          });
        });
      });
    });
  });

  describe('POST', () => {
    describe('When given valid input', () => {
      test('Then like the tree', async () => {
        /** Arrange */
        const treeData = {
          common: faker.animal.dog(),
          scientific: faker.animal.cat(),
          city: faker.address.cityName(),
          datePlanted: new Date(),
          lat: Number(faker.address.latitude()),
          lng: Number(faker.address.longitude()),
        };

        const tree = await axiosAPIClient.post('/trees', treeData);

        const treeLikeData = {
          id: tree.data.id,
          email: faker.internet.email(),
          common: tree.data.common,
          nickname: faker.name.findName(),
          request: {
            name: 'adopted',
            type: 'POST',
          },
        };

        const adoptedTree = await axiosAPIClient.post(
          '/treeadoptions',
          treeLikeData,
        );

        /** Act */
        const params = {
          id: adoptedTree.data.id,
          email: treeLikeData.email,
          request: 'adopted',
        };

        const treeAdoptions = await axiosAPIClient.get('/treeadoptions', {
          params,
        });

        /** Assert */
        expect(treeAdoptions).toMatchObject({
          status: 200,
          data: {
            adopted: true,
            adoptedCount: 1,
          },
        });
      });
    });

    test.todo('Then update the tree history');
  });

  describe('DELETE', () => {
    describe('When given valid input', () => {
      test('Then unadopt the tree', async () => {
        /** Arrange */
        const treeData = {
          common: faker.animal.dog(),
          scientific: faker.animal.cat(),
          city: faker.address.cityName(),
          datePlanted: new Date(),
          lat: Number(faker.address.latitude()),
          lng: Number(faker.address.longitude()),
        };

        const tree = await axiosAPIClient.post('/trees', treeData);

        // Like the tree
        const adoptedTreeData = {
          id: tree.data.id,
          email: faker.internet.email(),
          common: tree.data.common,
          nickname: faker.name.findName(),
          request: {
            name: 'liked',
            type: 'POST',
          },
        };

        await axiosAPIClient.post('/treeadoptions', adoptedTreeData);

        /** Act */
        const unAdoptedTreeBody = {
          ...adoptedTreeData,
          request: {
            name: 'liked',
            type: 'DELETE',
          },
        };

        const unAdoptedTree = await axiosAPIClient.post(
          '/treeadoptions',
          unAdoptedTreeBody,
        );

        /** Assert */
        expect(unAdoptedTree).toMatchObject({
          status: 200,
          data: {
            success: true,
          },
        });
      });

      test.todo('Then update the tree history');
    });
  });
});
