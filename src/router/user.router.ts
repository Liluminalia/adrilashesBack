import { Router } from 'express';
import { UserController } from '../controller/user.controller.js';
import { Admin, Authentication, logged } from '../middlewares/interceptor.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';

export const userRouter = Router();
const controller = new UserController(
    UserRepository.getInstance(),
    TreatmentRepository.getInstance()
);
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.get('/', controller.getAll.bind(controller));
userRouter.patch(
    '/appointments/add/:treatmentId',
    logged,
    Authentication,
    controller.addUserTreatment.bind(controller)
);
userRouter.patch(
    '/appointments/discount/:treatmentId/:userId/:discount',
    logged,
    Authentication,
    Admin,
    controller.discountUserAppointment.bind(controller)
);
