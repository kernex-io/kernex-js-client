import KernexResource from './KernexResource';
import KernexClient from './KernexClient';

export * from './KernexClient';
export * from './requests';
export { KernexResource };

export default function kernexClient<Resources extends Record<string, unknown>>(baseUrl: string) {
  return new KernexClient<Resources>(baseUrl);
}
