import debugCreator from 'debug';
import mongoose from 'mongoose';
import {
    ProtoTreatmentI,
    TreatmentI,
    Treatment,
} from '../entities/treatment.js';
import { id, Repo } from './repo.js';

const debug = debugCreator('FP:repository:treatment');

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
        return await this.#Model.find();
    }
    async get(id: id): Promise<TreatmentI> {
        const result = await this.#Model.findById(id);
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
        return result;
    }
    async delete(id: id): Promise<{ id: id }> {
        const result = await this.#Model.findByIdAndDelete(id);
        if (result === null) {
            throw new Error('Not found id');
        }
        return { id: id };
    }
    async post(data: ProtoTreatmentI): Promise<TreatmentI> {
        const result = await this.#Model.create(data);
        return result;
    }

    disconnect() {
        mongoose.disconnect();
    }
    getModel() {
        return this.#Model;
    }
}
