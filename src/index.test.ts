import kernexClient from './index';

describe('kernexClient', () => {
  it('should be defined', () => {
    const client = kernexClient({
      appUrl: '',
      appApiKey: '',
    });
    expect(client).toBeDefined();
  });

  it('works as expected with typescript types', () => {
    type BlogPost = {
      title: string;
      content: string;
      views: number;
    };

    type Note = {
      title: string;
      content: string;
      tags: string[];
    };

    type Resources = {
      blogPosts: BlogPost[];
      notes: Note[];
    };

    const client = kernexClient<Resources>({
      appUrl: '',
      appApiKey: '',
    });
    expect(client).toBeDefined();
  });
});
