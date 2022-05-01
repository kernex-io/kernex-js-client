import KernexResource from './KernexResource';
import KernexClient from './KernexClient';

export * from './KernexClient';
export * from './requests';
export { KernexResource };

export interface kernexClientOptions {
  appUrl: string;
  appApiKey: string;
}

export default function kernexClient<Resources extends Record<string, unknown>>(options: kernexClientOptions) {
  return new KernexClient<Resources>(options.appUrl, options.appApiKey);
}
