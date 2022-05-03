import KernexResource from './KernexResource';
import {ResourceDeclaration, ResourcesMap} from './resources';

export default class KernexClient<Resources extends ResourcesMap> {
  constructor(readonly baseUrl: string, readonly apiKey: string) {}

  /**
   * Get an instance of resource class.
   * @param resourceName
   */
  resource<
    ResourceName extends keyof Resources & string = string,
    Resource extends ResourceDeclaration = Resources[ResourceName]
  >(
    resourceName: ResourceName,
  ) {
    return new KernexResource<Resource>(this.baseUrl, this.apiKey, resourceName);
  }
}
