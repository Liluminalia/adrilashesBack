import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../repository/user.repository';
import { admin, authentication, ExtraRequest, logged } from './interceptor';
describe('given logged function', () => {
    describe('when authorization is ok ', () => {
        test('then should have been called', () => {
            const req: Partial<ExtraRequest> = {
                get: jest
                    .fn()
                    .mockReturnValueOnce(
                        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzODcyZjJkZDZmZmFiMDRkOTgxNTM0NCIsIm5hbWUiOiJhZHJpYW5hU2FsbGVzIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjcwMDAxOTUxfQ.9v54DWN5tAjxjrzb-leNzQSPEL9t-jceAzX5h88-z1s'
                    ),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();

            expect(req.payload).toStrictEqual({
                id: expect.any(String),
                iat: expect.any(Number),
                name: 'adrianaSalles',
                role: 'admin',
            });
        });
    });
    describe('when authorization is not ok ', () => {
        test('then if the authString is empty, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce(false),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
        test('Then if the token its not valid, it should return an error', () => {
            const req: Partial<Request> = {
                get: jest.fn().mockReturnValueOnce('Bearer token'),
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            logged(req as Request, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
});
describe('Given authentication function', () => {
    describe('When the payload.id is equal to userId', () => {
        const userRepository = UserRepository.getInstance();
        test('then it should call next function', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    name: 'adrianaSalles',
                    id: '63872f2dd6ffab04d9815344',
                    role: 'admin',
                },
            };
            userRepository.get = jest
                .fn()
                .mockResolvedValue({ id: '63872f2dd6ffab04d9815344' });
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await authentication(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When the payload.id is different to userId', () => {
        const userRepository = UserRepository.getInstance();
        test('then it should call next function and throw an error', async () => {
            const req: Partial<ExtraRequest> = {
                payload: {
                    name: 'adrianaSalles',
                    id: '63872f2dd6ffab04d9815344',
                    role: 'admin',
                },
            };
            userRepository.get = jest
                .fn()
                .mockResolvedValue({ id: '63872f2dd6ffab5559815344' });
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            await authentication(req as ExtraRequest, res as Response, next);
            expect(next).toHaveBeenCalled();
        });
    });
    describe('When the payload is not ok', () => {
        test('Then it should throw an error', () => {
            const req: Partial<ExtraRequest> = {
                payload: undefined,
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();
            const error = new Error('usuario o contraseña incorrectos');
            authentication(req as ExtraRequest, res as Response, next);
            expect(error).toBeInstanceOf(Error);
        });
    });
});
describe('Given admin function', () => {
    const userRepository = UserRepository.getInstance();
    describe('When the payload is not ok', () => {
        test('Then it should throw an error', () => {
            const user = {
                id: '63872f2dd6ffab04d9815344',
                role: 'admin',
            };
            userRepository.get = jest.fn().mockResolvedValue(user);
            const req: Partial<ExtraRequest> = {
                payload: undefined,
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();
            const error = new Error('usuario o contraseña incorrectos');
            admin(req as ExtraRequest, res as Response, next);
            expect(error).toBeInstanceOf(Error);
        });
    });
    describe('When role is admin', () => {
        test('then should have been called', () => {
            const user = {
                id: '63872f2dd6ffab04d9815344',
                role: 'admin',
            };
            userRepository.get = jest.fn().mockResolvedValue(user);
            const req: Partial<ExtraRequest> = {
                payload: {
                    name: 'adrianaSalles',
                    id: '63872f2dd6ffab04d9815344',
                    role: 'admin',
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();

            admin(req as ExtraRequest, res as Response, next);
            expect(user.role && req.payload!.role).toBe('admin');
        });
    });
    describe('When the role is not admin', () => {
        test('Then it should throw an error', () => {
            const user = {
                id: '63872f2dd6ffab04d9815344',
                role: 'user',
            };
            userRepository.get = jest.fn().mockResolvedValue(user);
            const req: Partial<ExtraRequest> = {
                payload: {
                    name: 'adrianaSalles',
                    id: '63872f2dd6ffab04d9815344',
                    role: 'user',
                },
            };
            const res: Partial<Response> = {};
            const next: NextFunction = jest.fn();
            const error = new Error('usuario o contraseña incorrectos');
            admin(req as ExtraRequest, res as Response, next);
            expect(error).toBeInstanceOf(Error);
        });
    });
});
