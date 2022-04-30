import * as qs from 'qs';
import { Paginated, Query } from './requests';

function getQueryString<T>(query: Query<T> = {}) {
  if (Object.keys(query).length !== 0) {
    return `?${qs.stringify(query)}`;
  }

  return '';
}

function getUrl<T>(baseUrl: string, query: Query<T> = {}) {
  return `${baseUrl}${getQueryString(query)}`;
}

class KernexResource<Resource> {
  private readonly resourceUrl: string;

  constructor(private readonly baseUrl: string, resourceName: string) {
    this.resourceUrl = `${baseUrl}/${resourceName}`;
  }

  /**
   * Create a new resource entry
   * @param data
   */
  async create(data: Partial<Resource>): Promise<Resource> {
    return this.fetch(this.resourceUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get a single resource entry
   * @param id
   * @param query
   */
  async get(id: string, query?: Query<Resource>): Promise<Resource> {
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, query), {
      method: 'GET',
    });
  }

  /**
   * Find a list of resource entries
   * @param query
   */
  async find(query?: Query<Resource>): Promise<Paginated<Resource>> {
    return this.fetch(getUrl(this.resourceUrl, query), {
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
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, query), {
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
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, query), {
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
    return this.fetch(getUrl(`${this.resourceUrl}/${id}`, query), {
      method: 'DELETE',
    });
  }

  private async fetch(resourceUrl: string = this.resourceUrl, init: RequestInit = {}) {
    const response = await fetch(resourceUrl, {
      ...init,
      headers: {
        ...init.headers,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();

    if (!response.ok) {
      throw data;
    }

    return data;
  }
}

export default KernexResource;
