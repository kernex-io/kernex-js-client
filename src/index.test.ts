import kernexClient from './index';

describe('kernexClient', () => {
  it('should be defined', () => {
    const client = kernexClient('baseUrl');
    expect(client).toBeDefined();
  });
});
