import mongoose from 'mongoose';
import { dataBaseConnect } from '../data.base.connect.js';
import { TreatmentRepository } from './treatment.repository.js';
import { UserRepository } from './user.repository.js';

describe('Given UserRepository', () => {
    const mockData = [
        {
            name: 'antonio',
            email: 'pepe@gmail.com',
            password: 'pepe1234',
        },
        {
            name: 'sebastian',
            email: 'ernest@gmail.com',
            password: '789ErnesT',
        },
    ];
    const repository = UserRepository.getInstance();
    TreatmentRepository.getInstance();
    let testIds: Array<string>;
    beforeAll(async () => {
        await dataBaseConnect();
        await repository.getUserModel().deleteMany();
        await repository.getUserModel().insertMany(mockData);
        const data = await repository.getUserModel().find();
        testIds = [data[0].id, data[1].id];
    });
    afterAll(async () => {
        mongoose.disconnect();
    });
    describe('when getAll is called', () => {
        test('Then  should return an array of users', async () => {
            const result = await repository.getAll();
            expect(result[0].name).toEqual('antonio');
        });
    });
    describe('when get is called', () => {
        test('Then  should return an user', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.name).toEqual(mockData[0].name);
        });

        test('and receives an invalid id then should return an error', async () => {
            expect(async () => {
                await repository.get(testIds[4]);
            }).rejects.toThrowError();
        });
    });

    describe('when post is called', () => {
        test('Then should return the new user', async () => {
            const newUser = {
                name: 'tarantino',
                email: 'killbill@gmail.com',
                password: 'asd123',
            };
            const result = await repository.post(newUser);
            expect(result.name).toBe('tarantino');
        });
        test('and receive an invalid id then should return an error', async () => {
            expect(async () => {
                await repository.post({ password: testIds[3] });
            }).rejects.toThrowError();
        });
    });
    describe('when patch is called', () => {
        test('Then should return the user updated', async () => {
            const updatedUser = {
                email: 'timon@gmail.com',
                password: 'asd123',
            };
            const result = await repository.patch(testIds[0], updatedUser);
            expect(result.email).toBe('timon@gmail.com');
        });
        test('and receive an invalid id then should return an error', async () => {
            expect(async () => {
                await repository.patch(testIds[3], mockData[1]);
            }).rejects.toThrowError();
        });
    });
    describe('when find is called ', () => {
        test('Then should return a user', async () => {
            const result = await repository.find(testIds[1]);
            expect(result.name).toEqual(mockData[1].name);
        });
        test('and receive an invalid id then should return an error', async () => {
            expect(async () => {
                await repository.find('');
            }).rejects.toThrow();
        });
    });
});
