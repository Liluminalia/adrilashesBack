import { Router } from 'express';
import { TreatmentController } from '../controller/treatment.controller.js';
import { admin, authentication, logged } from '../middlewares/interceptor.js';
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
    authentication,
    controller.get.bind(controller)
);
treatmentRouter.post(
    '/create',
    logged,
    authentication,
    admin,
    controller.post.bind(controller)
);
treatmentRouter.patch(
    '/update/:id',
    logged,
    authentication,
    admin,
    controller.patch.bind(controller)
);
treatmentRouter.delete(
    '/delete/:id',
    logged,
    authentication,
    admin,
    controller.delete.bind(controller)
);
