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
            role: 'user',
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
describe('given an "app" with "/users" route', () => {
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
        test('then the get (GET ALL ok) to urls /users should send a 200 status', async () => {
            await request(app)
                .get('/users')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);
        });
        test('then the get (GET ALL NO ok) to urls /users should send a 404 status', async () => {
            await request(app)
                .get('/usir')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
        test('then the get (GET OK) to urls /users/:userId should send status 200', async () => {
            const response = await request(app)
                .get(`/users/${ids[1]}`)
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
        });
        test('then the get (GET NO OK) to urls /users/:id, if id is not in the DB, should send status 403', async () => {
            const response = await request(app).get(
                '/users/6378d483b74569e5d87e8685'
            );
            expect(response.status).toBe(403);
        });
        test('then the get (GET NO OK 2) to urls /users/:id, if id is bad formed, should send status 403', async () => {
            const response = await request(app).get('/users/34');
            expect(response.status).toBe(403);
        });
        test('then the (POST LOGIN OK) post of login to urls /users send status 201', async () => {
            const mockLogin = {
                name: 'froilan',
                password: '1234',
            };
            await request(app).post('/users/register').send(mockLogin);
            const response = await request(app)
                .post('/users/login')
                .send(mockLogin);

            expect(response.status).toBe(201);
        });
        test('then the (POST LOGIN NO OK) post of login to urls /users with wrong password should send status 503', async () => {
            const mockLogin = {
                name: 'froilan',
                password: '1234',
            };
            const badMock = {
                name: 'froilan',
                password: '3215',
            };
            await request(app).post('/users/register').send(mockLogin);
            const response = await request(app)
                .post('/users/login')
                .send(badMock);

            expect(response.status).toBe(503);
        });
        test('then the (POST REGISTER OK) post of register to urls /users send status 201', async () => {
            const mockRegister = {
                name: 'froilan',
                password: '1234',
            };
            const response = await request(app)
                .post('/users/register')
                .send(mockRegister)
                .send(mockRegister);

            expect(response.status).toBe(201);
        });
        test('then the (POST REGISTER NO OK) post of register to urls /users with no name should send status 503', async () => {
            const mockRegister = {
                password: '1234',
            };
            await request(app).post('/users/register').send(mockRegister);
            const response = await request(app)
                .post('/users/login')
                .send(mockRegister);

            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH ADD OK) to urls /users/appointments/add/:treatmentId with authorization should send status 202', async () => {
            const response = await request(app)
                .patch(`/users/appointments/add/${treatmentIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(202);
        });
        test.skip('then the patch (PATCH ADD ID NO OK) to urls /users/appointments/add/:treatmentId with authorization and if id is not in the DB should send status 503', async () => {
            const response = await request(app)
                .patch('/users/appointments/add/6378d483b738f3e5d87e8685')
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH ADD ID NO OK 2) to urls /users/appointments/add/:treatmentId with authorization and if id is bad formed should send status 503', async () => {
            const response = await request(app)
                .patch('/users/appointments/add/56')
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH ADD NO OK) to urls /users/appointments/add/:treatmentId without authorization should send status 403', async () => {
            const response = await request(app)
                .patch(`/users/appointments/add/${treatmentIds[0]}`)
                .send(ids[0]);

            expect(response.status).toBe(403);
        });
        test('then the patch (PATCH DELETE OK) to urls /users/appointments/delete/:treatmentId/:userId with authorization should send status 202', async () => {
            const response = await request(app)
                .patch(
                    `/users/appointments/delete/${treatmentIds[0]}/${ids[1]}`
                )
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(202);
        });
        test('then the patch (PATCH DELETE ID NO OK) to urls /users/appointments/delete/:treatmentId/:userId with authorization and if id is not in the DB should send status 503', async () => {
            const response = await request(app)
                .patch(
                    `/users/appointments/delete/${treatmentIds[0]}/6378d483b738f3e5d87e8685`
                )
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH DELETE ID NO OK 2) to urls /users/appointments/delete/:treatmentId/:userId with authorization and if id is bad formed should send status 503', async () => {
            const response = await request(app)
                .patch(`/users/appointments/delete/${treatmentIds[0]}/635`)
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH DELETE NO OK) to urls /users/appointments/delete/:treatmentId/:userId without authorization should send status 403', async () => {
            const response = await request(app)
                .patch(
                    `/users/appointments/delete/${treatmentIds[0]}/${ids[1]}`
                )
                .send(ids[0]);

            expect(response.status).toBe(403);
        });

        test.skip('then the patch (PATCH DISCOUNT OK) to urls /appointments/discount/:treatmentId/:userId/:discount with authorization should send status 202', async () => {
            await request(app)
                .patch(`/users/appointments/add/${treatmentIds[0]}`)
                .set('Authorization', `Bearer ${token}`)
                .send(ids[1]);
            const response = await request(app)
                .patch(
                    `/users/appointments/discount/${treatmentIds[0]}/${ids[1]}/30`
                )
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(202);
        });
        test('then the patch (PATCH DISCOUNT ID NO OK) to urls /appointments/discount/:treatmentId/:userId/:discount with authorization and if id is not in the DB should send status 503', async () => {
            const response = await request(app)
                .patch(
                    `/users/appointments/discount/${treatmentIds[0]}/6378d483b738f3e5d87e8685/30`
                )
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH DISCOUNT ID NO OK 2) to urls /appointments/discount/:treatmentId/:userId/:discount with authorization and if id is bad formed should send status 503', async () => {
            const response = await request(app)
                .patch(`/users/appointments/discount/${treatmentIds[0]}/635/30`)
                .set('Authorization', `Bearer ${token}`)
                .send(ids[0]);
            expect(response.status).toBe(503);
        });
        test('then the patch (PATCH DISCOUNT NO OK) to urls /appointments/discount/:treatmentId/:userId/:discount without authorization should send status 403', async () => {
            const response = await request(app)
                .patch(
                    `/users/appointments/discount/${treatmentIds[0]}/${ids[1]}/30`
                )
                .send(ids[0]);

            expect(response.status).toBe(403);
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
