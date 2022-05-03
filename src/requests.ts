export interface Paginated<T> {
  total: number;
  limit: number;
  skip: number;
  data: T[];
}

export interface AdvancedFilter<T, Field extends keyof T> {
  /**
   * Find all records where the property matches any of the given values.
   */
  $in: T[Field][] | T[Field];

  /**
   * Find all records where the property does not match any of the given values.
   */
  $nin: T[Field][] | T[Field];

  /**
   * Find all records where the value is less than a given value.
   */
  $lt: T[Field];

  /**
   * Find all records where the value is less or equal to a given value.
   */
  $lte: T[Field];

  /**
   * Find all records where the value is more than a given value.
   */
  $gt: T[Field];

  /**
   * Find all records where the value is more or equal to a given value.
   */
  $gte: T[Field];

  /**
   * Find all records that do not equal the given property value.
   */
  $ne: T[Field];
}

/**
 * Field filter
 * If the property type is an array then we can accept both an array as a filter or a single item.
 * Example: {
 *    userIds: 2,
 * }
 * will return the elements where userIds array has the element "2"
 */
export type FieldFilter<T> = T extends any[] ? (T[number] | T) : T;

type QueryReservedParameters = '$limit' | '$skip' | '$select' | '$sort' | '$join';

export type ResourceFilters<T> = {
  [Field in keyof T]?: FieldFilter<T[Field]> | Partial<AdvancedFilter<T, Field>>
};

export type Sort<T> = {
  [P in keyof T]?: 1 | -1;
};

/**
 * A join condition for a query
 */
export type QueryJoin = {
  /**
   * The name of the resource to join
   */
  resource: string;

  /**
   * The field name of the relation id. Example: for a blog post with a category relation, and a
   * "categoryId" field, this would be "categoryId".
   */
  on: string;

  /**
   * The field name where the resource will be added. Example: for a blog post with a category relation, if you
   * set this field to "category", the blog post will look like: {
   *   // ... blog post fields,
   *   category: { name: 'Category Name Here' } // Blog post category here
   * }
   */
  as: string;
}

export interface BaseQuery<T = unknown> {
  $limit?: number;
  $skip?: number;
  $select?: Array<string | keyof T>;
  $sort?: Sort<T>;
  $join?: QueryJoin[];

  [key: string]: any;
}

export type Query<T = unknown> = Partial<BaseQuery<T> & Partial<Omit<ResourceFilters<T>, QueryReservedParameters>>>;

export type ServerQuery<T = unknown> = Partial<Omit<Query<T>, '$join'>> & Partial<{
  $client?: {
    $join?: Query<T>['$join'];
  }
}>
