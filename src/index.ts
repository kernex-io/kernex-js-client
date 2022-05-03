import KernexResource from './KernexResource';
import KernexClient from './KernexClient';
import { ResourcesMap } from './resources';

export * from './KernexClient';
export * from './requests';
export * from './resources';
export { KernexResource };

export interface kernexClientOptions {
  appUrl: string;
  appApiKey: string;
}

export default function kernexClient<Resources extends ResourcesMap>(options: kernexClientOptions) {
  return new KernexClient<Resources>(options.appUrl, options.appApiKey);
}
