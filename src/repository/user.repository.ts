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
    getAll(): Promise<Array<UserI>> {
        const result = this.#Model.find().populate('appointment');
        if (!result) {
            throw new Error('not found');
        }
        return result as unknown as Promise<Array<UserI>>;
    }
    get(id: id): Promise<UserI> {
        const result = this.#Model.findById(id).populate('appointment');
        if (!result) {
            throw new Error('not found id');
        }
        return result as unknown as Promise<UserI>;
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
    patch(id: id, data: Partial<UserI>): Promise<UserI> {
        const result = this.#Model
            .findByIdAndUpdate(id, data, {
                new: true,
            })
            .populate('appointment');
        if (!result) {
            throw new Error('Not found id');
        }
        return result as unknown as Promise<UserI>;
    }
    find(search: any): Promise<UserI> {
        const result = this.#Model.findOne(search).populate('appointment');
        if (!result) {
            throw new Error('not found id');
        }
        return result as unknown as Promise<UserI>;
    }

    getUserModel() {
        return this.#Model;
    }
}
