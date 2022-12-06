import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import { dataBaseConnect } from '../data.base.connect.js';
import { Treatment } from '../entities/treatment.js';
import { User } from '../entities/user.js';
import { createToken, TokenPayload } from '../services/auth.js';

const setCollection = async () => {
    const usersMock = [
        {
            name: 'adri',
            email: 'd',
            phone: 'string',
            role: 'admin',
            isVip: true,
        },
        {
            name: 'marcos',
            email: 'stridfgdng',
            phone: 'string',
            role: 'admin',
            isVip: true,
        },
    ];
    await User.deleteMany();
    await User.insertMany(usersMock);
    const data = await User.find();
    const testIds = [data[0].id, data[1].id];
    return testIds;
};
let ids: Array<string>;

const setCollectionTreatment = async () => {
    const treatmentsMock = [
        {
            title: 'string',
            img: 'string',
            description: 'string',
            price: 235,
            time: 235,
        },
    ];
    await Treatment.deleteMany();
    await Treatment.insertMany(treatmentsMock);
    const data2 = await Treatment.find();
    const testTreatmentIds = [data2[0].id];
    return testTreatmentIds;
};
describe('given an "app" with "/treatments" route', () => {
    describe('when we connect with mongoDB', () => {
        let token: string;
        let treatmentIds: Array<string>;
        beforeEach(async () => {
            await dataBaseConnect();
            ids = await setCollection();
            treatmentIds = await setCollectionTreatment();
            const payload: TokenPayload = {
                id: ids[0],
                name: 'adri',
                role: 'admin',
            };
            token = createToken(payload);
        });
        afterEach(async () => {
            await mongoose.disconnect();
        });
        test('then the get (GET ALL ok) to urls /treatments should send a 200 status', async () => {
            await request(app).get('/treatments').expect(200);
        });
        test('then the get (GET ALL NO ok) to urls /treatments should send a 404 status', async () => {
            await request(app).get('/treants').expect(404);
        });
        test('then the get (GET OK) to urls /treatments/:id should send status 200', async () => {
            const response = await request(app)
                .get(`/treatments/${treatmentIds[0]}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        test('then the get (GET NO OK) to urls /treatments/:id, if id is not in the DB, should send status 403', async () => {
            const response = await request(app).get(
                '/treatments/6378d483b74569e5d87e8685'
            );
            expect(response.status).toBe(403);
        });
        test('then the get (GET NO OK 2) to urls /treatments/:id, if id is bad formed, should send status 403', async () => {
            const response = await request(app).get('/treatments/34');
            expect(response.status).toBe(403);
        });
        test('then the post (POST OK) to urls /treatments with authorization should send status 201', async () => {
            const response = await request(app)
                .post('/treatments/create')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    title: 'patata',
                    img: 'patata bella',
                    description: 'es una patata bella',
                    price: 35,
                    time: 23,
                });

            expect(response.status).toBe(201);
        });
        test('then the post (POST NO OK) to urls /treatments without authorization should send status 403', async () => {
            const response = await request(app)
                .post('/treatments/create')
                .send({
                    title: 'patata',
                    img: 'patata bella',
                    description: 'es una patata bella',
                    price: 35,
                    time: 23,
                });
            expect(response.status).toBe(403);
        });
        test('then the patch (PATCH OK) to urls /treatments/update/:id with authorization should send status 202', async () => {
            const response = await request(app)
                .patch(`/treatments/update/${treatmentIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(202);
        });
        test('then the patch (PATCH AUTH NO OK) to urls /treatments/update/:id without authorization should send status 403', async () => {
            const response = await request(app)
                .patch(`/treatments/update/${treatmentIds[0]}`)
                .send({ title: 'marcos' });

            expect(response.status).toBe(403);
        });
        test('then the patch (PATCH ID NO OK) to urls /treatments/update/:id  if id is not in the DB, should send status 503', async () => {
            const response = await request(app)
                .patch('/treatments/update/6378d483b738f3e5d87e8685')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'sara' });

            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH ID NO OK 2) to urls /treatments/update/:id  if id is bad formed, should send status 503', async () => {
            const response = await request(app)
                .patch('/treatments/update/635')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'sara' });

            expect(response.status).toBe(503);
        });
        test('then the delete (DELETE OK) to urls /treatments/delete/:id with authorization should send status 200', async () => {
            const response = await request(app)
                .delete(`/treatments/delete/${treatmentIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ name: 'adri' });
            expect(response.status).toBe(200);
        });
        test('then the delete (DELETE AUTH NO OK) to urls /treatments/delete/:id without authorization should send status 403', async () => {
            const response = await request(app)
                .delete(`/treatments/delete/${treatmentIds[0]}`)
                .send({ name: 'marcos' });
            expect(response.status).toBe(403);
        });
        test('then the delete (DELETE ID NO OK) to urls /treatments/delete/:id if id bad formed, should send status 503', async () => {
            const response = await request(app)
                .delete('/treatments/delete/635')
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'potato' });
            expect(response.status).toBe(503);
        });
    });
});
describe('given an "app" with "/" route', () => {
    describe('when we connect with mongoDB', () => {
        test('then the get to urls / should send a 200 status', async () => {
            await dataBaseConnect();

            const response = await request(app).get('/');
            expect(response.status).toBe(200);
            await mongoose.disconnect();
        });
    });
});
