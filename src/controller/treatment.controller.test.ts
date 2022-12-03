import { NextFunction, Request, Response } from 'express';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';
import { ProtoTreatmentI, TreatmentI } from '../entities/treatment.js';
import { CustomError, HTTPError } from '../interfaces/error.js';
import { TreatmentController } from './treatment.controller.js';
import { Types } from 'mongoose';
jest.mock('../services/auth');
describe('Given TreatmentController', () => {
    describe('When we instantiate it', () => {
        const repository = TreatmentRepository.getInstance();
        const userRepository = UserRepository.getInstance();
        const treatmentController = new TreatmentController(
            repository,
            userRepository
        );

        const userId = new Types.ObjectId();
        const mockData: Array<TreatmentI> = [
            {
                id: '638bb6c1aacbf2a5689ee24d',
                title: 'pestañas',
                img: 'sss',
                description: '7',
                price: 8,
                time: 45,
            },
            {
                id: '638bb6c1aacbf2a5689ee456',
                title: 'uñas',
                img: 'sss',
                description: '4',
                price: 5,
                time: 30,
            },
        ];
        const mockTreatment: TreatmentI = {
            id: '638bb6c1aacbf2a5689e1348',
            title: 'pier',
            img: 'sfg',
            description: '4sdss',
            price: 6,
            time: 68,
        };
        repository.get = jest.fn().mockResolvedValue(mockData[0]);
        repository.patch = jest.fn().mockResolvedValue(mockData[0]);
        repository.post = jest.fn().mockResolvedValue(mockTreatment);
        repository.delete = jest.fn().mockResolvedValue(mockData[1]);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        test('Then getAll should have been called', async () => {
            repository.getAll = jest.fn().mockResolvedValue(mockData);

            await treatmentController.getAll(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });

        test.only('Then get should have been called', async () => {
            req.params = { id: '638bb6c1aacbf2a5689ee24d' };
            await treatmentController.get(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalled();
        });

        test('Then post should have been called', async () => {
            await treatmentController.post(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ treatments: mockData });
        });

        test('Then patch should have been called', async () => {
            await treatmentController.patch(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ treatments: mockData });
        });
        test('Then delete should have been called', async () => {
            await treatmentController.delete(
                req as Request,
                res as Response,
                next
            );
            expect(res.json).toHaveBeenCalledWith({ treatments: mockData });
        });
    });
    describe('when we dont instantiate it', () => {
        const error: CustomError = new HTTPError(
            404,
            'Not found id',
            'message of error'
        );
        const repository = TreatmentRepository.getInstance();
        const userRepository = UserRepository.getInstance();

        const treatmentController = new TreatmentController(
            repository,
            userRepository
        );
        repository.getAll = jest.fn().mockRejectedValue(HTTPError);
        repository.get = jest.fn().mockRejectedValue(HTTPError);
        repository.post = jest.fn().mockRejectedValue(HTTPError);
        repository.patch = jest.fn().mockRejectedValue(HTTPError);
        repository.delete = jest.fn().mockRejectedValue(3);

        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            json: jest.fn(),
        };
        const next: NextFunction = jest.fn();
        test('Then if something went wrong getAll should throw an error', async () => {
            await treatmentController.getAll(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong get should throw an error', async () => {
            await treatmentController.get(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong post should throw an error', async () => {
            await treatmentController.post(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong patch should throw an error', async () => {
            await treatmentController.patch(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
        test('Then if something went wrong delete should throw an error', async () => {
            await treatmentController.delete(
                req as Request,
                res as Response,
                next
            );
            expect(error).toBeInstanceOf(HTTPError);
        });
    });
});
