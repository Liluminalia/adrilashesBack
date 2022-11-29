import debugCreator from 'debug';
import mongoose, { Types } from 'mongoose';
import {
    ProtoTreatmentI,
    TreatmentI,
    Treatment,
} from '../entities/treatment.js';
import { id, Repo } from './repo.js';

const debug = debugCreator('W6:repository:treatment');

export class TreatmentRepository implements Repo<TreatmentI> {
    static instance: TreatmentRepository;

    public static getInstance(): TreatmentRepository {
        if (!TreatmentRepository.instance) {
            TreatmentRepository.instance = new TreatmentRepository();
        }
        return TreatmentRepository.instance;
    }
    #Model = Treatment;
    private constructor() {
        debug('instance');
    }
    async getAll(): Promise<Array<TreatmentI>> {
        return this.#Model.find();
    }
    async get(id: id): Promise<TreatmentI> {
        const result = await this.#Model
            .findById(id)
            .populate<{ _id: Types.ObjectId }>('appointment', {
                treatments: 0,
            });
        if (!result) {
            throw new Error('Not found id');
        }
        return result;
    }
    async patch(id: id, data: Partial<TreatmentI>): Promise<TreatmentI> {
        const result = await this.#Model.findByIdAndUpdate(id, data, {
            new: true,
        });
        if (!result) {
            throw new Error('Not found id');
        }
        return result as TreatmentI;
    }
    async delete(id: id): Promise<{ id: id }> {
        const result = (await this.#Model.findByIdAndDelete(id)) as TreatmentI;
        if (result === null) {
            throw new Error('Not found id');
        }
        return { id: id };
    }
    async post(data: ProtoTreatmentI): Promise<TreatmentI> {
        const result = await this.#Model.create(data);
        return result as TreatmentI;
    }
    async find(search: {
        [key: string]: string | number | Date;
    }): Promise<TreatmentI> {
        const result = await this.#Model
            .findOne(search)
            .populate('appointment', { treatments: 0 });
        if (!result) {
            throw new Error('not found id');
        }
        return result as unknown as TreatmentI;
    }
    disconnect() {
        mongoose.disconnect();
    }
    getModel() {
        return this.#Model;
    }
}
