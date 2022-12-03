import { Router } from 'express';
import { TreatmentController } from '../controller/treatment.controller.js';
import { Admin, Authentication, logged } from '../middlewares/interceptor.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';

export const treatmentRouter = Router();
const controller = new TreatmentController(
    TreatmentRepository.getInstance(),
    UserRepository.getInstance()
);
treatmentRouter.get('/', controller.getAll.bind(controller));
treatmentRouter.get(
    '/:id',
    logged,
    Authentication,
    controller.get.bind(controller)
);
treatmentRouter.post(
    '/create',
    logged,
    Authentication,
    Admin,
    controller.post.bind(controller)
);
treatmentRouter.patch(
    '/update/:id',
    logged,
    Authentication,
    Admin,
    controller.patch.bind(controller)
);
treatmentRouter.delete(
    '/delete/:id',
    logged,
    Authentication,
    Admin,
    controller.delete.bind(controller)
);
