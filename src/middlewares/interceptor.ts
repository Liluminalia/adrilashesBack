import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';
import { JwtPayload } from 'jsonwebtoken';
import { UserRepository } from '../repository/user.repository.js';
export interface ExtraRequest extends Request {
    payload?: JwtPayload;
}

export const logged = (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const authString = req.get('Authorization');

    if (!authString || !authString?.startsWith('Bearer')) {
        next(
            new HTTPError(403, 'Forbidden', 'usuario o contraseña incorrecto')
        );
        return;
    }
    try {
        const token = authString.slice(7);
        req.payload = readToken(token);
        next();
    } catch (error) {
        next(
            new HTTPError(403, 'Forbidden', 'usuario o contraseña incorrecto')
        );
    }
};
export const Authentication = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const userRepo = UserRepository.getInstance();

    try {
        const user = await userRepo.get((req.payload as JwtPayload).id);
        if (req.payload && user.id.toString() !== req.payload.id) {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'usuario o contraseña incorrectos'
                )
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};
export const Admin = async (
    req: ExtraRequest,
    res: Response,
    next: NextFunction
) => {
    const userRepo = UserRepository.getInstance();

    try {
        if (!req.payload) {
            throw new Error('invalid payload');
        }
        const user = await userRepo.get(req.payload.id);

        if (user.role !== 'admin') {
            next(
                new HTTPError(
                    403,
                    'Forbidden',
                    'usuario o contraseña incorrectos'
                )
            );
            return;
        }
        next();
    } catch (error) {
        next(error);
    }
};
