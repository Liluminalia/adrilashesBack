import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptor.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { passwordComparer, createToken } from '../services/auth.js';
import { UserController } from './user.controller.js';
jest.mock('../services/auth');
describe('Given UserController', () => {
    describe('When we instantiate it correctly', () => {
        const repository = UserRepository.getInstance();
        const treatmentRepo = TreatmentRepository.getInstance();
        const userController = new UserController(repository, treatmentRepo);

        const userId = new Types.ObjectId();
        const treatmentId = new Types.ObjectId();

        repository.post = jest.fn().mockResolvedValue({
            id: userId,
            name: 'Antonio',
            role: 'admin',
        });
        repository.find = jest.fn().mockResolvedValue({
            id: userId,
            name: 'Ignacio',
            role: 'admin',
            appointments: [treatmentId],
        });
        repository.getAll = jest.fn().mockResolvedValue([
            {
                id: userId,
                name: 'pepe',
                role: 'admin',
            },
        ]);
        repository.get = jest.fn().mockResolvedValue({
            id: userId,
            name: 'Uri',
            role: 'admin',
        });

        repository.patch = jest.fn().mockResolvedValue([
            {
                id: userId,
                name: 'panela',
                role: 'admin',
            },
        ]);
        let req: Partial<ExtraRequest>;
        let res: Partial<Response>;
        let next: NextFunction;
        beforeEach(() => {
            req = {};
            req.params = {
                treatmentId: treatmentId.toString(),
            };
            req.payload = { id: userId };

            res = {};
            res.status = jest.fn().mockReturnValue(res);
            next = jest.fn();
            res.json = jest.fn().mockReturnValue(res);
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
                    name: 'Antonio',
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
        test('Then getAll should have been called', async () => {
            await userController.getAll(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalled();
        });
        test('Then getOne should have been called', async () => {
            await userController.getOne(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalled();
        });
        test('Then addUserTreatment should have been called', async () => {
            treatmentRepo.get = jest.fn().mockResolvedValue({
                id: '6388eeb8b065a23947e964ff',
                name: 'uñas',
            });
            await userController.addUserTreatment(
                req as ExtraRequest,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });
        test('Then deleteUserAppointment should have been called', async () => {
            repository.find = jest.fn().mockResolvedValue({
                _id: '6388eeb8b1233a23947e964ii',
                name: 'tioPhill',
                role: 'user',
                appointments: [{ _id: { _id: '6388eeb8b065a23947e964ff' } }],
            });
            req.params = {
                userId: '6388eeb8b1233a23947e964ii',
                treatmentId: '6388eeb8b065a23947e964ff',
            };
            await userController.deleteUserAppointment(
                req as ExtraRequest,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });
        test('Then discountUserAppointment should have been called', async () => {
            repository.find = jest.fn().mockResolvedValue({
                _id: '638b88666b322e85bf317pi5',
                name: 'papaya',
                role: 'user',
                appointments: [{ _id: { _id: '638b88008b322e85bf317fe3' } }],
            });
            req.params = {
                treatmentId: '638b88008b322e85bf317fe3',
                userId: '638b88666b322e85bf317pi5',
                discount: '50',
            };
            await userController.discountUserAppointment(
                req as ExtraRequest,
                res as Response,
                next
            );

            expect(res.json).toHaveBeenCalled();
        });
        test('Then discountUserAppointment if there is no appointment it should throw an error', async () => {
            repository.find = jest.fn().mockResolvedValue({
                _id: '638b88666b322e85bf317pi5',
                name: 'papaya',
                role: 'user',
                appointments: [{ _id: { _id: '638be3' } }],
            });
            req.params = {
                treatmentId: '638b88008b322e85bf317fe3',
                userId: '638b88666b322e85bf317pi5',
                discount: '50',
            };
            const error = new Error('Not found id');
            await userController.discountUserAppointment(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(Error);
        });
    });
    describe('when we instantiate it not properly', () => {
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

        test('Then register should throw an error', async () => {
            await userController.register(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        describe('then login', () => {
            test('should throw an error', async () => {
                await userController.login(
                    req as Request,
                    res as Response,
                    next
                );
                expect(error).toBeInstanceOf(HTTPError);
            });

            test('if password is not valid, should throw an error', async () => {
                (passwordComparer as jest.Mock).mockResolvedValue(false);
                (createToken as jest.Mock).mockReturnValue('token');
                req.body = { password: 'patata' };

                await userController.login(
                    req as Request,
                    res as Response,
                    next
                );

                expect(error).toBeInstanceOf(HTTPError);
            });
            test('if there is not password, should throw an error', async () => {
                repository.find = jest.fn().mockResolvedValue({
                    id: '637d1d346346f6ff04b55896',
                    name: 'pepe',
                    role: 'admin',
                });

                await userController.login(
                    req as Request,
                    res as Response,
                    next
                );

                expect(error).toBeInstanceOf(HTTPError);
            });
            test('if there is not user, should throw an error', async () => {
                error.message = 'Not found id';
                repository.find = jest.fn().mockResolvedValue(HTTPError);

                await userController.login(
                    req as Request,
                    res as Response,
                    next
                );

                expect(error.message).toEqual('Not found id');
            });
        });

        test('Then getAll should throw an error', async () => {
            repository.getAll = jest.fn().mockRejectedValue(HTTPError);
            await userController.getAll(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then getOne should throw an error', async () => {
            repository.get = jest.fn().mockRejectedValue(HTTPError);
            await userController.getOne(req as Request, res as Response, next);
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then addUserTreatment should throw an error', async () => {
            repository.find = jest.fn().mockRejectedValue(HTTPError);
            await userController.addUserTreatment(
                req as ExtraRequest,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then discountUserAppointment should throw an error', async () => {
            repository.find = jest.fn().mockRejectedValue(HTTPError);
            await userController.discountUserAppointment(
                req as ExtraRequest,
                res as Response,
                next
            );

            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then deleteUserAppointment should throw an error', async () => {
            repository.find = jest.fn().mockRejectedValue(HTTPError);
            await userController.deleteUserAppointment(
                req as ExtraRequest,
                res as Response,
                next
            );

            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
