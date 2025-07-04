import { Model, FilterQuery } from "mongoose";
import { IBaseRepository } from "../../domain/interface/repositoryInterfaces/base-repository.interface";

export class BaseRepository<T> implements IBaseRepository<T> {
	constructor(protected model: Model<T>) {}

	async find(filter: FilterQuery<T> = {}) {
		return this.model.find(filter);
	}
	async findAll(filter: FilterQuery<T> = {}, skip = 0, limit = 10, sort: Record<string, 1 | -1> = {}) {
		const [items, total] = await Promise.all([
			this.model.find(filter).skip(skip).limit(limit).sort(sort).lean() as Promise<
				T[]
			>,
			this.model.countDocuments(filter),
		]);
		return { items, total };
	}

	async findOne(filter: FilterQuery<T>) {
		return this.model.findOne(filter).lean() as Promise<T>;
	}

	async save(data: Partial<T>) {
		return this.model.create(data);
	}

	async update(filter: FilterQuery<T>, updateData: Partial<T>) {
		return this.model
			.findOneAndUpdate(filter, updateData, { new: true })
			.lean() as Promise<T>;
	}

	async delete(filter: FilterQuery<T>) {
		return this.model.findOneAndDelete(filter).lean() as Promise<T>;
	}
}
