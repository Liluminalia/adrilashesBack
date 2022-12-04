import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../interfaces/error';
import { errorManager } from './errors';

describe('Given errorManager()', () => {
    describe('When we instantiate it', () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnValue({}),
            json: jest.fn().mockReturnValue({}),
            end: jest.fn().mockReturnValue({}),
        };
        const next = jest.fn();

        const mock500 = {
            name: 'Internal Server Error',
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Error',
        };

        const mock406 = {
            name: 'Validation Error',
            statusCode: 406,
            statusMessage: 'Validation Error',
            message: 'Error',
        };

        test('Then it should call the NextFunction', () => {
            errorManager(
                mock500,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toBeCalled();
        });

        test('If we receive a 406 Error, then it should call the NextFunction with a 406 status', () => {
            errorManager(
                mock406,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toBeCalled();
        });
        test('If there is no error.statuscode then it should return a status 500', () => {
            const mockBadError = {
                name: 'Error',
                statusMessage: 'Internal Server Error',
                message: 'Error',
            };

            errorManager(
                mockBadError as CustomError,
                req as Request,
                res as unknown as Response,
                next as NextFunction
            );
            expect(res.status).toBeCalled();
        });
    });
});
