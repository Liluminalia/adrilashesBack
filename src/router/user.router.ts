import { Router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';

export const userRouter = Router();
const controller = new UserController(
    new UserRepository(),
    TreatmentRepository.getInstance()
);
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.get('/', controller.getAll.bind(controller));
userRouter.patch(
    '/appointments/add/:userId/:treatmentId',
    controller.addUserTreatment.bind(controller)
);
