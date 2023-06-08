/* eslint-disable object-curly-newline */
import {
  Model,
  Query,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
  Document,
} from 'mongoose';
import { ClientSession } from 'mongodb';

export abstract class BaseRepository<T extends Document> {
  protected constructor(protected readonly model: Model<T>) {}

  public async create(
    payload: unknown,
    session?: ClientSession,
  ): Promise<T | any> {
    if (session) return this.model.create(payload, { session });
    return this.model.create(payload);
  }

  public async updateMany(query: FilterQuery<T>, payload: UpdateQuery<T>) {
    return this.model.updateMany({ ...query }, { ...payload });
  }

  public async findOne(
    query: FilterQuery<T>,
    projections?: any | null,
  ): Promise<T | null> {
    return this.model.findOne(query, projections).lean();
  }

  public async findOneWithPopulation(
    query: FilterQuery<T>,
    population: any,
    projections?: any | null,
  ): Promise<T | null> {
    return this.model.findOne(query, projections).populate(population).lean();
  }

  public async findOneAndUpdate(
    query: FilterQuery<T>,
    payload: UpdateQuery<Partial<T>>,
    options?: QueryOptions,
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(query, payload, {
        new: true,
        ...options,
      })
      .lean();
  }

  public async transactionalFindOneAndUpdate(
    query: FilterQuery<T>,
    payload: UpdateQuery<T>,
    session: ClientSession,
    options?: QueryOptions,
  ) {
    return this.model
      .findOneAndUpdate(query, payload, {
        new: true,
        ...options,
      })
      .session(session);
  }

  public async find(
    query: FilterQuery<T>,
    projections?: any | null,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model.find(query, projections, options).lean();
  }

  public async findWithPopulation(
    query: FilterQuery<T>,
    population: any,
    projections?: any | null,
    options?: QueryOptions,
  ): Promise<T[]> {
    return this.model
      .find(query, projections, options)
      .populate(population)
      .lean();
  }

  public async findById(id: string, withPassword = false): Promise<T | null> {
    const query = this.model.findById(id);

    if (!withPassword) {
      query.select('-password');
    }

    return query.lean();
  }

  public async sort(
    modelQuery: Query<any, any>,
    sortConditions: any,
  ): Promise<T> {
    return modelQuery.sort({ ...sortConditions });
  }

  public async count(query: FilterQuery<T>): Promise<number> {
    return this.model.count(query);
  }
}
