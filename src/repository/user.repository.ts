import { UserI, User } from '../entities/user.js';
import { passwordEncrypt } from '../services/auth.js';
import { BasicRepo, ExtraRepo, id } from './repo.js';
import debugCreator from 'debug';

const debug = debugCreator('FP:repository:user');

export class UserRepository implements BasicRepo<UserI>, ExtraRepo<UserI> {
    static instance: UserRepository;
    private constructor() {
        debug('instance');
    }
    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    #Model = User;
    async getAll(): Promise<Array<UserI>> {
        return await this.#Model.find().populate('appointment');
    }
    async get(id: id): Promise<UserI> {
        const result = await this.#Model.findById(id).populate('appointment');
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
        ).populate('appointment');
        return result;
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
        return result;
    }
    async find(search: any): Promise<UserI> {
        const result = await this.#Model.findOne(search);
        if (!result) {
            throw new Error('not found id');
        }
        return result;
    }

    getUserModel() {
        return this.#Model;
    }
}
