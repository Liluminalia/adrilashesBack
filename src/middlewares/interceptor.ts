import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../interfaces/error.js';
import { readToken } from '../services/auth.js';
import { JwtPayload } from 'jsonwebtoken';
import { TreatmentRepository } from '../repository/treatment.repository.js';
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
    const treatmentRepo = TreatmentRepository.getInstance();

    try {
        const treatment = await treatmentRepo.get(req.params.id);

        if (req.payload && treatment.id.toString() !== req.payload.id) {
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
