import { CustomError } from '../interfaces/error.js';
import { NextFunction, Request, Response } from 'express';
import debugCreator from 'debug';

const debug = debugCreator('W6:middleware:errors');

export const errorManager = (
    error: CustomError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    debug(error.name, error.statusCode, error.statusMessage, error.message);
    let status = error.statusCode || 500;
    if (error.name === 'Validation Error') {
        status = 406;
    }
    const result = {
        status: status,
        type: error.name,
        error: error.message,
    };
    res.status(status);
    res.json(result);
    res.end();
};
