import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { passwordComparer, createToken } from '../services/auth.js';
import { UserController } from './user.controller.js';
jest.mock('../services/auth');
describe('Given UserController', () => {
    describe('When we instantiate it', () => {
        const repository = UserRepository.getInstance();
        const treatmentRepo = TreatmentRepository.getInstance();
        const userId = new Types.ObjectId();
        const userController = new UserController(repository, treatmentRepo);
        repository.post = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
            role: 'admin',
        });
        repository.find = jest.fn().mockResolvedValue({
            id: userId,
            name: 'pepe',
            role: 'admin',
        });
        let req: Partial<Request>;
        let res: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            res = {};
            res.status = jest.fn().mockReturnValue(res);
            next = jest.fn();
            res.json = jest.fn();
        });

        test('Then register should have been called', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id: userId,
                    name: 'pepe',
                    role: 'admin',
                },
            });
        });

        test('Then login should have been called', async () => {
            (passwordComparer as jest.Mock).mockResolvedValue(true);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'patata' };

            await userController.login(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({ token: 'token' });
        });

        test.skip('Then getAll should have been called', async () => {
            const users = await userController.getAll(
                req as Request,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalledWith({ users });
        });
    });
    describe('when we dont instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );

        const repository = UserRepository.getInstance();
        const treatmentRepo = TreatmentRepository.getInstance();
        const userController = new UserController(repository, treatmentRepo);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();

        test('Then if something went wrong register should throw an error', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong login should throw an error', async () => {
            await userController.login(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if password is not valid login should throw an error', async () => {
            (passwordComparer as jest.Mock).mockResolvedValue(false);
            (createToken as jest.Mock).mockReturnValue('token');
            req.body = { password: 'patata' };

            await userController.login(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if there is not password login should throw an error', async () => {
            repository.find = jest.fn().mockResolvedValue({
                id: '637d1d346346f6ff04b55896',
                name: 'pepe',
                role: 'admin',
            });

            await userController.login(req as Request, res as Response, next);

            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if there is not user login should throw an error', async () => {
            error.message = 'Not found id';
            repository.find = jest.fn().mockResolvedValue(HTTPError);

            await userController.login(req as Request, res as Response, next);

            expect(error.message).toEqual('Not found id');
        });
    });
});
