import KernexResource from './KernexResource';
import * as fetch from 'cross-fetch';

const BASE_URL = 'https://api.kernex.io/api/v1/testAppId';
const resourceName = 'blog-posts';
const resourceUrl = `${BASE_URL}/resource/${resourceName}`;
const apiKey = 'testApiKey';

type BlogPost = {
  title: string;
  views: number;
}

const resource = new KernexResource<BlogPost>(BASE_URL, apiKey, resourceName);

const fetchMockBaseResponse: Omit<Response, 'json'> = {
  body: null,
  headers: new Headers(),
  status: 200,
  statusText: "OK",
  ok: true,
  url: resourceUrl,
  arrayBuffer: async () => new ArrayBuffer(0),
  blob: async () => new Blob(),
  clone: jest.fn(),
  formData: async () => new FormData(),
  text: async () => "dummy text",
  redirected: false,
  type: 'basic',
  bodyUsed: true,
};

jest.mock('cross-fetch', () => {
  //Mock the default export
  return {
    __esModule: true,
    default: async (input: RequestInfo, init?: RequestInit) => ({
      ...fetchMockBaseResponse,
      json: async () => JSON.parse(String(init?.body)),
    }),
  };
});

describe('KernexResource', () => {
  it('should be defined', () => {
    expect(resource).toBeDefined();
  });

  describe('create method', () => {
    it('should call fetch with the right endpoint and request parameters', async () => {
      const spy = jest.spyOn(fetch, 'default');
      const blogPost = { title: 'test', views: 0 };

      const response = await resource.create({ title: 'test', views: 0 });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(resourceUrl, {
        method: 'POST',
        body: JSON.stringify(blogPost),
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
      });
      expect(response).toStrictEqual(blogPost);
    });
  });
});
