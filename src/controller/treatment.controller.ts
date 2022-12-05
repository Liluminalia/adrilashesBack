import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { Repo, BasicRepo } from '../repository/repo.js';
import { TreatmentI } from '../entities/treatment.js';
import { UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { ExtraRequest } from '../middlewares/interceptor.js';

const debug = createDebug('W6:controllers:treatment');

export class TreatmentController {
    constructor(
        public repository: Repo<TreatmentI>,
        public userRepository: BasicRepo<UserI>
    ) {
        debug('instance');
    }
    async getAll(req: Request, resp: Response, next: NextFunction) {
        try {
            const treatments = await this.repository.getAll();
            resp.json({ treatments });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async get(req: Request, resp: Response, next: NextFunction) {
        try {
            const treatment = await this.repository.get(req.params.id);
            resp.json({ treatment });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async post(req: ExtraRequest, resp: Response, next: NextFunction) {
        try {
            debug('post');
            if (!req.payload) {
                throw new Error('invalid payload');
            }
            const treatment = await this.repository.post(req.body);
            resp.status(201).json({ treatment });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );

            next(httpError);
        }
    }
    async patch(req: Request, resp: Response, next: NextFunction) {
        try {
            const treatments = await this.repository.patch(
                req.params.id,
                req.body
            );

            resp.status(202).json({ treatments });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async delete(req: Request, resp: Response, next: NextFunction) {
        try {
            await this.repository.delete(req.params.id);
            resp.status(200).json({});
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    #createHttpError(error: Error) {
        const httpError = new HTTPError(
            503,
            'Service unavailable',
            error.message
        );
        return httpError;
    }
}
