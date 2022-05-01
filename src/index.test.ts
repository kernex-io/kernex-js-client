import kernexClient from './index';

describe('kernexClient', () => {
  it('should be defined', () => {
    const client = kernexClient({
      appUrl: '',
      appApiKey: '',
    });
    expect(client).toBeDefined();
  });
});
