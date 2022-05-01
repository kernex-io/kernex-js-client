import KernexResource from './KernexResource';

export default class KernexClient<Resources extends Record<string, unknown>> {
  constructor(readonly baseUrl: string, readonly apiKey: string) {
  }

  resource<ResourceName extends keyof Resources & string = string, Resource = Resources[ResourceName]>(
    resourceName: ResourceName,
  ) {
    return new KernexResource<Resource>(this.baseUrl, this.apiKey, resourceName);
  }
}
