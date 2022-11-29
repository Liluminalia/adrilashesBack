import {
    createToken,
    getSecret,
    passwordComparer,
    passwordEncrypt,
    readToken,
} from './auth';
import jwt from 'jsonwebtoken';
import bc from 'bcryptjs';

const mock = { id: '45', name: 'froilan', role: 'admin' };
describe('given createToken', () => {
    describe('when...', () => {
        test('then...', () => {
            const signSpy = jest.spyOn(jwt, 'sign');
            const r = createToken(mock);
            expect(typeof r).toBe('string');
            expect(signSpy).toHaveBeenCalled();
        });
    });
});
describe('given readToken', () => {
    describe('when token is valid', () => {
        const tokenMock = createToken(mock);
        test('then...', () => {
            const r = readToken(tokenMock);
            expect(r.name).toBe(mock.name);
        });
    });
    describe('when token is not valid', () => {
        const tokenMock =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InBlcGUiLCJpYXQiOjE2Njg3NzMxMzB9.RqJsFrOFnYmPoP2HxJXuWPZrAe-qSLvWoYjgHZpOENA';
        test('then...', () => {
            expect(() => {
                readToken(tokenMock);
            }).toThrow();
        });
    });
    describe('when token is not formatted', () => {
        const tokenMock = 'bad formatted token';
        test('then...', () => {
            expect(() => {
                readToken(tokenMock);
            }).toThrow();
        });
    });
});
describe('given passwordEncrypt', () => {
    describe('when...', () => {
        test('then...', async () => {
            const signSpy = await jest.spyOn(bc, 'hash');
            const r = await passwordEncrypt('froilan');
            expect(typeof r).toBe('string');
            expect(signSpy).toHaveBeenCalled();
        });
    });
});
describe('given passwordComparer', () => {
    describe('when...', () => {
        test('then...', async () => {
            const signSpy = await jest.spyOn(bc, 'compare');
            const encrypt = await passwordEncrypt('froilan');
            const r = await passwordComparer('froilan', encrypt);
            expect(r).toBe(true);
            expect(signSpy).toHaveBeenCalled();
        });
    });
});
describe('given getSecret', () => {
    describe('when...', () => {
        test('then...', () => {
            process.env.SECRET = '';
            expect(async () => {
                await getSecret(process.env.SECRET);
            }).rejects.toThrow();
        });
    });
});
