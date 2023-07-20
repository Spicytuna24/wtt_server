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

describe('/treelikes', () => {
  describe('GET', () => {
    describe('When valid tree and valid user', () => {
      describe('When the user has not liked the tree', () => {
        test('Then confirm the user has not liked the tree', async () => {
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

          const treeLikes = await axiosAPIClient.get('/treelikes', {
            params,
          });

          /** Assert */
          expect(treeLikes).toMatchObject({
            status: 200,
            data: {
              liked: false,
              likedCount: 0,
            },
          });
        });
      });

      describe('When the user has liked the tree', () => {
        test('Then confirm the user has liked the tree', async () => {
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

          const newTreeLikeData = {
            id: tree.data.id,
            common: tree.data.common,
            email: user.email,
            nickname: user.nickname,
            request: {
              type: 'POST',
            },
          };

          const newTreeLike = await axiosAPIClient.post(
            '/treelikes',
            newTreeLikeData,
          );

          /** Act */
          const params = {
            id: newTreeLike.data.id,
            email: user.email,
          };

          const treeLikes = await axiosAPIClient.get('/treelikes', {
            params,
          });

          /** Assert */
          expect(treeLikes).toMatchObject({
            status: 200,
            data: {
              liked: true,
              likedCount: 1,
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
            name: 'liked',
            type: 'POST',
          },
        };

        const likedTree = await axiosAPIClient.post('/treelikes', treeLikeData);

        /** Act */
        const params = {
          id: likedTree.data.id,
          email: treeLikeData.email,
          request: 'liked',
        };

        const treeLikes = await axiosAPIClient.get('/treelikes', {
          params,
        });

        /** Assert */
        expect(treeLikes).toMatchObject({
          status: 200,
          data: {
            liked: true,
            likedCount: 1,
          },
        });
      });

      test.todo('Then update the tree history');
    });
  });

  describe('DELETE', () => {
    describe('When given valid input', () => {
      test('Then unlike the tree', async () => {
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
        const likedTreeData = {
          id: tree.data.id,
          email: faker.internet.email(),
          common: tree.data.common,
          nickname: faker.name.findName(),
          request: {
            name: 'liked',
            type: 'POST',
          },
        };

        await axiosAPIClient.post('/treelikes', likedTreeData);

        /** Act */
        const unLikedTreeData = {
          ...likedTreeData,
          request: {
            name: 'liked',
            type: 'DELETE',
          },
        };

        const unLikedTree = await axiosAPIClient.post(
          '/treelikes',
          unLikedTreeData,
        );

        /** Assert */
        expect(unLikedTree).toMatchObject({
          status: 200,
          data: {
            success: true,
          },
        });
      });
    });

    test.todo('Then update the tree history');
  });
});
