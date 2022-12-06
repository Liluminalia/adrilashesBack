import { NextFunction, Request, Response } from 'express';
import { Appointment, UserI } from '../entities/user.js';
import { HTTPError } from '../interfaces/error.js';
import { FullRepo, Repo } from '../repository/repo.js';
import { createToken, passwordComparer } from '../services/auth.js';
import { TreatmentI } from '../entities/treatment.js';
import createDebug from 'debug';
import { ExtraRequest } from '../middlewares/interceptor.js';
const debug = createDebug('FP:controller:users');

export class UserController {
    constructor(
        public readonly repository: FullRepo<UserI>,
        public readonly treatmentRepository: Repo<TreatmentI>
    ) {
        debug('instance');
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
            res.status(201).json({ token });
        } catch (error) {
            next(this.#createHttpError(error as Error));
        }
    }
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.repository.getAll();
            res.json({ users });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.repository.get(req.params.userId);
            res.json({ users });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async addUserTreatment(
        req: ExtraRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.repository.find({ _id: req.payload.id });
            const treatment = await this.treatmentRepository.get(
                req.params.treatmentId
            );
            user.appointments.push(treatment as unknown as Appointment);
            this.repository.patch(user.id, { appointments: user.appointments });
            res.status(202).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async discountUserAppointment(
        req: ExtraRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            if (!req.payload) {
                throw new Error('Invalid payload');
            }
            const user = await this.repository.find({
                _id: req.params.userId,
            });
            const appointment = await user.appointments.find(
                (appointment) =>
                    appointment._id._id.toString() === req.params.treatmentId
            );
            if (!appointment) {
                throw new Error('Not found id');
            }
            appointment.discount = +req.params.discount;
            const finalPrice =
                (appointment._id as unknown as TreatmentI).price -
                appointment.discount;
            (appointment._id as unknown as TreatmentI).price = finalPrice;
            this.repository.patch(user.id, { appointments: user.appointments });
            res.status(202).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
        }
    }
    async deleteUserAppointment(
        req: ExtraRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await this.repository.find({
                _id: req.params.userId,
            });
            user.appointments = user.appointments.filter(
                (treatment) =>
                    treatment._id._id.toString() !== req.params.treatmentId
            );
            await this.repository.patch(user.id, {
                appointments: user.appointments,
            });

            res.status(202).json({ user });
        } catch (error) {
            const httpError = new HTTPError(
                503,
                'Service unavailable',
                (error as Error).message
            );
            next(httpError);
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
