import { UserI, User } from '../entities/user.js';
import { passwordEncrypt } from '../services/auth.js';
import { BasicRepo, id } from './repo.js';

export class UserRepository implements BasicRepo<UserI> {
    static instance: UserRepository;

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }
    #Model = User;
    async get(id: id): Promise<UserI> {
        const result = (await this.#Model.findById(id)) as UserI;
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
        const result = await this.#Model.create(data);
        return result as unknown as UserI;
    }
    async find(search: any): Promise<UserI> {
        const result = (await this.#Model.findOne(search)) as UserI;
        if (!result) {
            throw new Error('not found id');
        }
        return result;
    }

    getUserModel() {
        return this.#Model;
    }
}
