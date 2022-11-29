import { NextFunction, Request, Response } from 'express';
import { UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { BasicRepo, Repo } from '../repository/repo.js';
import { createToken, passwordComparer } from '../services/auth.js';
import { TreatmentI } from '../entities/treatment.js';

export class UserController {
    constructor(
        public readonly repository: BasicRepo<UserI>,
        public readonly treatmentRepository: Repo<TreatmentI>
    ) {
        //
    }
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.post(req.body);
            res.status(201).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.repository.find({ name: req.body.name });
            const isPasswordValid = await passwordComparer(
                req.body.password,
                user.password
            );
            if (!isPasswordValid) {
                throw new Error();
            }
            const token = createToken({
                id: user.id.toString(),
                name: user.name,
                role: user.role,
            });
            res.json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        if (error.message === 'Not found id') {
            const httpError = new HTTPError(404, 'Not Found', error.message);
            return httpError;
        }
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
