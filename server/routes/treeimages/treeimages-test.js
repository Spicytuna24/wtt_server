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

describe('/api/treeimages', () => {
  /** Arrange */
  const mockBody = () => {
    const idImage = faker.name.findName();
    const body = {
      treeimages: {
        idImage,
        id_image: 'id_image',
        image_description: 'image description',
        image_url: 'image_url',
        image_filename: 'image_filename',
        photographer: 'photographer',
        image_type: 'image_type',
        image_number: 'image_number',
      },
    };
    return body;
  };

  describe('POST', () => {
    describe('Post an image to the tree_images table', () => {
      test('Then confirm the image is returned', async () => {
        /** Arrange */
        const body = mockBody();
        /** Act */

        const { data, status } = await axiosAPIClient.post('/treeimage', body);

        const dataObj = {
          treeimages: { idImage: body.source.idImage },
        };

        /** Assert */
        expect(status).toBe(200);
        expect(data).toMatchObject(dataObj);
      });
    });
  });

  describe('GET', () => {
    describe('Get image by specified number', () => {
      test('Then confirm one image is returned', async () => {
        /** Arrange */
        const body = mockBody();
        /** Act */
        const { data } = await axiosAPIClient.post('/treeimage:filenumber', body);
        /** Act */
        const params = { idSourceName: data?.source?.idSourceName };
        const response = await axiosAPIClient.get('/treeimage:filenumber', {
          params,
        });

        /** Assert */
        expect(response?.status).toBe(200);
        expect(response?.data).toMatchObject(body);
      });
      test('Then confirm the returned object contains an image', async () => {
        /** Arrange */
        const body = mockBody();
        const expected = ['treeimages'];
        /** Act */
        const { data } = await axiosAPIClient.post('/treeimages:filenumber', body);
        /** Act */
        const params = { idSourceName: data?.source?.idSourceName };
        const response = await axiosAPIClient.get('/treeimages:filenumber', {
          params,
        });

        /** Assert */
        expect(response?.status).toBe(200);
        expect(Object.keys(response?.data)).toEqual(
          expect.arrayContaining(expected),
        );
      });
    });
    describe(`When images aquired is specified by 'All'`, () => {
      test('Then confirm the images are returned in Array', async () => {
        /** Arrange */
        const body = mockBody();
        const body2 = mockBody();
        // const bodyArray = [body, body2];
        /** Act */
        await axiosAPIClient.post('/treeimages:filenumber', body);
        await axiosAPIClient.post('/treeimages:filenumber', body2);
        /** Act */
        const params = { treeimages: 'All' };
        const response = await axiosAPIClient.get('/treeimages:filenumber', {
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
});
