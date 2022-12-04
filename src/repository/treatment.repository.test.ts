import { dataBaseConnect } from '../data.base.connect.js';
import { TreatmentRepository } from './treatment.repository.js';
const mockData = [
    {
        title: 'froilan',
        img: 'ertert',
        description: 'ertert',
        price: 2,
        time: 35,
    },
    {
        title: 'amancio ortega',
        img: 'retret',
        description: 'ertert',
        price: 5,
        time: 45,
    },
];
describe('Given TreatmentRepository', () => {
    const repository = TreatmentRepository.getInstance();
    let testIds: Array<string>;
    beforeAll(async () => {
        await dataBaseConnect();
        await repository.getModel().deleteMany();
        await repository.getModel().insertMany(mockData);
        const data = await repository.getModel().find();
        testIds = [data[0].id, data[1].id];
    });
    describe('When we instantiate getAll', () => {
        test('then should have been called', async () => {
            const result = await repository.getAll();
            expect(result[0].title).toEqual(mockData[0].title);
        });
    });
    describe('When we instantiate get ', () => {
        test('then should have been called', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.title).toEqual('froilan');
        });
        test('Then if id is bad formate should throw an error', async () => {
            expect(async () => {
                await repository.get(testIds[3]);
            }).rejects.toThrow();
        });
    });
    describe('When we instantiate post', () => {
        test('Then should have been called', async () => {
            const newTreatment = {
                title: 'jeff bezzos',
                img: 'dfgdfg',
                description: 'ujkhjk',
                price: 6,
                time: 45,
            };
            const result = await repository.post(newTreatment);
            const newTreatment2 = {
                title: 'jeff bezzos',
                img: 'jkhr',
                description: 'fguols',
                price: 25,
                time: 35,
                id: result.id,
            };
            expect(result.id).toEqual(newTreatment2.id);
        });
    });
    describe('When we instantiate patch', () => {
        test('Then should have been called', async () => {
            const updatedTreatment = {
                title: 'tomas',
                img: 'dgerer',
                description: 'ujuiuiui',
                price: 9,
            };
            const result = await repository.patch(testIds[0], updatedTreatment);
            expect(result.price).toEqual(9);
        });
        test('Then if id is bad formate should throw an error', async () => {
            expect(async () => {
                await repository.patch(testIds[3], mockData[1]);
            }).rejects.toThrowError();
        });
    });
    describe('When we instantiate delete', () => {
        test('Then should have been called', async () => {
            const result = await repository.delete(testIds[0]);
            expect(result).toEqual({ id: testIds[0] });
        });
        test('Then if id is not an id should throw an error', async () => {
            expect(async () => {
                await repository.delete('23');
            }).rejects.toThrow();
        });
        test('Then if id is null should throw an error', async () => {
            expect(async () => {
                await repository.delete('');
            }).rejects.toThrow();
        });
        test('Then if id is bad should throw an error', async () => {
            expect(async () => {
                await repository.delete('6378d483b738f8e5d87e8285');
            }).rejects.toThrow();
        });
        test('Then if id is bad formate should throw an error', async () => {
            expect(async () => {
                await repository.delete(testIds[3]);
            }).rejects.toThrow();
        });
    });

    afterAll(() => {
        repository.disconnect();
    });
});
