import { Types } from 'mongoose';
import { UserI, User } from '../entities/user.js';
import { passwordEncrypt } from '../services/auth.js';
import { BasicRepo, id } from './repo.js';
import debugCreator from 'debug';

const debug = debugCreator('FP:repository:user');

export class UserRepository implements BasicRepo<UserI> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    #Model = User;
    async getAll(): Promise<Array<UserI>> {
        const result = await this.#Model.find().populate<{
            treatmentId: Types.ObjectId;
        }>('appointment');
        if (!result) {
            throw new Error('not found');
        }
        return result;
    }
    async get(id: id): Promise<UserI> {
        const result = await this.#Model.findById(id).populate<{
            treatmentId: Types.ObjectId;
        }>('appointment');
        if (!result) {
            throw new Error('not found id');
        }
        return result;
    }
    async post(data: Partial<UserI>): Promise<UserI> {
        if (typeof data.password !== 'string') {
            throw new Error('');
        }
        data.password = await passwordEncrypt(data.password);
        const result = await (
            await this.#Model.create(data)
        ).populate<{
            treatmentId: Types.ObjectId;
        }>('appointment');
        return result as unknown as UserI;
    }
    async patch(id: id, data: Partial<UserI>): Promise<UserI> {
        const result = await this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('appointment');
        if (!result) {
            throw new Error('Not found id');
        }
        return result as UserI;
    }
    async find(search: any): Promise<UserI> {
        const result = await this.#Model.findOne(search).populate<{
            treatmentId: Types.ObjectId;
        }>('appointment');
        if (!result) {
            throw new Error('not found id');
        }
        return result;
    }

    getUserModel() {
        return this.#Model;
    }
}
