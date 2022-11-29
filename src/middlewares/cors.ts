import { NextFunction, Request, Response } from 'express';
import debugCreator from 'debug';

const debug = debugCreator('W8:middleware:cors');

export const setCors = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.header('Origin') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);

    next();
};
