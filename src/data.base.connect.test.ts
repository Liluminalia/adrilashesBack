import { dataBaseConnect } from './data.base.connect.js';
import mongoose from 'mongoose';
const spiConnect = jest.spyOn(mongoose, 'connect');
describe('given dataBaseConnect', () => {
    describe('when we call it', () => {
        test('then it should get connected to the data base', async () => {
            const result = await dataBaseConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('CodersTesting');

            mongoose.disconnect();
        });
    });
    describe('when we call it', () => {
        test('then it should get connected to the data base', async () => {
            process.env.NODE_ENV = 'finalProjectData';
            const result = await dataBaseConnect();
            expect(spiConnect).toHaveBeenCalled();
            expect(typeof result).toBe(typeof mongoose);
            expect(result.connection.db.databaseName).toBe('finalProjectData');
            mongoose.disconnect();
        });
    });
});
