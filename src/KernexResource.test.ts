import KernexResource from './KernexResource';

describe('KernexResource', () => {
  const BASE_URL = 'https://api.kernex.io/api/v1/testAppId';
  const resourceName = 'blog-posts';
  const resourceUrl = `${BASE_URL}/${resourceName}`;

  type BlogPost = {
    title: string;
    views: number;
  }

  const resource = new KernexResource<BlogPost>(BASE_URL, resourceName);

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

  it('should be defined', () => {
    expect(resource).toBeDefined();
  });

  describe('create method', () => {
    it('should call fetch with the right endpoint and request parameters', async () => {
      window.fetch = async (input: RequestInfo, init?: RequestInit) => ({
        ...fetchMockBaseResponse,
        json: async () => JSON.parse(String(init?.body)),
      });
      const spy = jest.spyOn(window, 'fetch');
      const blogPost = { title: 'test', views: 0 };

      const response = await resource.create({ title: 'test', views: 0 });
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(resourceUrl, {
        method: 'POST',
        body: JSON.stringify(blogPost),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(response).toStrictEqual(blogPost);
    });
  });
});
