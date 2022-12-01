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
    describe('When we instantiate it', () => {
        const repository = TreatmentRepository.getInstance();
        let testIds: Array<string>;
        // comented code to ask in daily
        // beforeAll(() => {
        //     repository.getModel().deleteMany();

        //     const data: Array<TreatmentI> = repository.getModel().find();
        //     testIds = [data[0].id, data[1].id];
        // });
        // beforeAll(async () => {
        //     await dataBaseConnect();
        //     repository.getModel().insertMany(mockData);
        // });

        test.skip('Then getAll should have been called', async () => {
            const result = await repository.getAll();
            expect(result[0].title).toEqual(mockData[0].title);
        });
        test.skip('Then get should have been called', async () => {
            const result = await repository.get(testIds[0]);
            expect(result.title).toEqual('froilan');
        });
        test.skip('Then if id is bad formate get should throw an error', async () => {
            expect(async () => {
                await repository.get(testIds[3]);
            }).rejects.toThrow();
        });
        test.skip('Then post should have been called', async () => {
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
        test.skip('Then patch should have been called', async () => {
            const updatedTreatment = {
                title: 'tomas',
                img: 'dgerer',
                description: 'ujuiuiui',
                price: 9,
            };
            const result = await repository.patch(testIds[0], updatedTreatment);
            expect(result.price).toEqual(9);
        });
        test.skip('Then if id is bad formate patch should throw an error', async () => {
            expect(async () => {
                await repository.patch(testIds[3], {});
            }).rejects.toThrowError();
        });
        test.skip('Then delete should have been called', async () => {
            const result = await repository.delete(testIds[0]);
            expect(result).toEqual({ id: testIds[0] });
        });
        test.skip('Then if id is not an id delete should throw an error', async () => {
            expect(async () => {
                await repository.delete('23');
            }).rejects.toThrow();
        });
        test.skip('Then if id is null delete should throw an error', async () => {
            expect(async () => {
                await repository.delete('');
            }).rejects.toThrow();
        });
        test.skip('Then if id is bad delete should throw an error', async () => {
            expect(async () => {
                await repository.delete('6378d483b738f8e5d87e8285');
            }).rejects.toThrow();
        });
        test.skip('Then if id is bad formate delete should throw an error', async () => {
            expect(async () => {
                await repository.delete(testIds[0]);
            }).rejects.toThrow();
        });
        test.skip('Then find should have been called', async () => {
            const result = await repository.find({ id: testIds[0] });
            expect(result.title).toEqual(mockData[1].title);
        });
        test.skip('Then if id is bad find should throw an error', async () => {
            expect(async () => {
                await repository.find({ id: '6378d483b738f8e5d87e8285' });
            }).rejects.toThrow();
        });
        test.skip('Then if id is not an id find should throw an error', async () => {
            expect(async () => {
                await repository.find({ id: '23' });
            }).rejects.toThrow();
        });
        test.skip('Then if id is null find should throw an error', async () => {
            expect(async () => {
                await repository.find({ id: '' });
            }).rejects.toThrow();
        });
        afterAll(() => {
            repository.disconnect();
        });
    });
});
