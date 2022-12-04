import { Router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { admin, authentication, logged } from '../middlewares/interceptor.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';

export const userRouter = Router();
const controller = new UserController(
    UserRepository.getInstance(),
    TreatmentRepository.getInstance()
);
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
    '/appointments/add/:treatmentId',
    logged,
    authentication,
    controller.addUserTreatment.bind(controller)
);
userRouter.patch(
    '/appointments/delete/:treatmentId/:userId',
    logged,
    authentication,
    admin,
    controller.deleteUserAppointment.bind(controller)
);
userRouter.patch(
    '/appointments/discount/:treatmentId/:userId/:discount',
    logged,
    authentication,
    admin,
    controller.discountUserAppointment.bind(controller)
);
userRouter.get(
    '/',
    logged,
    authentication,
    admin,
    controller.getAll.bind(controller)
);
userRouter.get(
    '/:userId',
    logged,
    authentication,
    admin,
    controller.getOne.bind(controller)
);
