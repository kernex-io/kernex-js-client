import * as qs from 'qs';
import {Paginated, Query, QueryJoin, ServerQuery} from './requests';

function getQueryString<T>(query: ServerQuery<T> = {}) {
  if (Object.keys(query).length !== 0) {
    return `?${qs.stringify(query)}`;
  }

  return '';
}

function getServerQuery<T>(query: Query<T>): ServerQuery<T> {
  const { $join, $search, ...rest } = query;

  const serverQuery: ServerQuery<T> = { ...rest };

  if ($join || $search) {
    serverQuery.$client = {};
    if ($join) {
      serverQuery.$client.$join = $join;
    }
    if ($search) {
      serverQuery.$client.$search = $search;
    }
  }

  return serverQuery;
}

function getUrl<T>(baseUrl: string, query: Query<T> = {}) {
  return `${baseUrl}${getQueryString(getServerQuery<T>(query))}`;
}

export type KernexResourceOptions = {
  $join?: QueryJoin[];
}

class KernexResource<Resource> {
  private readonly resourceUrl: string;

  private readonly options: KernexResourceOptions;

  constructor(
    private readonly baseUrl: string,
    readonly apiKey: string,
    resourceName: string,
    options: KernexResourceOptions = {},
  ) {
    this.resourceUrl = `${baseUrl}/resource/${resourceName}`;
    this.options = options;
  }

  getQuery<T = Resource>(query: Query<T> = {}): Query<T> | undefined {
    const { $join } = this.options;

    if (Object.keys(query).length === 0 && !$join) {
      return undefined;
    }

    return {
      $join,
      ...query,
    };
  };

  /**
   * Create a new resource entry
   * @param data
   * @param query
   */
  async create<Response = Resource>(data: Partial<Resource>, query?: Query<Resource>): Promise<Response> {
    return this.fetch(getUrl(this.resourceUrl, this.getQuery(query)), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a single resource entry
   * @param id
   * @param query
   */
  async get<GetResource = Resource>(id: string, query?: Query<GetResource>): Promise<GetResource> {
    return this.fetch<GetResource>(getUrl(`${this.resourceUrl}/${id}`, this.getQuery(query)), {
      method: 'GET',
    });
  }

  /**
   * Find a list of resource entries
   * @param query
   */
  async find<FindResource = Resource>(query?: Query<FindResource>): Promise<Paginated<FindResource>> {
    return this.fetch(getUrl(this.resourceUrl, this.getQuery(query)), {
      method: 'GET',
    });
  }

  /**
   * Patch a single resource entry
   * @param id
   * @param data
   * @param query
   */
  async patch(id: string, data: Partial<Resource>, query?: Query<Resource>): Promise<Resource> {
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, this.getQuery(query)), {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update a single resource entry
   * @param id
   * @param data
   * @param query
   */
  async update(id: string, data: Partial<Resource>, query?: Query<Resource>): Promise<Resource> {
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, this.getQuery(query)), {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Remove a single resource entry
   * @param id
   * @param query
   */
  async remove(id: string, query?: Query<Resource>): Promise<void> {
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, this.getQuery(query)), {
      method: 'DELETE',
    });
  }

  private async fetch<T>(resourceUrl: string = this.resourceUrl, init: RequestInit = {}): Promise<T> {
    const response = await fetch(resourceUrl, {
      ...init,
      headers: {
        ...init.headers,
        'Content-Type': 'application/json',
        'X-Api-Key': this.apiKey,
      },
    });
    const data = await response.json() as T;

    if (!response.ok) {
      throw data;
    }

    return data;
  }
}

export default KernexResource;
