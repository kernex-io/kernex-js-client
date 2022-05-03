import KernexResource, {KernexResourceOptions} from './KernexResource';
import { ResourcesMap } from './resources';

export default class KernexClient<Resources extends ResourcesMap> {
  constructor(readonly baseUrl: string, readonly apiKey: string) {}

  /**
   * Get an instance of resource class.
   * @param resourceName
   * @param options
   */
  resource<
    ResourceName extends keyof Resources & string = string,
    Resource = Resources[ResourceName]
  >(
    resourceName: ResourceName,
    options?: KernexResourceOptions,
  ) {
    return new KernexResource<Resource>(this.baseUrl, this.apiKey, resourceName, options);
  }
}
