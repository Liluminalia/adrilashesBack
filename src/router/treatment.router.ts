import { Router } from 'express';
import { TreatmentController } from '../controller/treatment.controller.js';
import { Authentication, logged } from '../middlewares/interceptor.js';
import { TreatmentRepository } from '../repository/treatment.repository.js';
import { UserRepository } from '../repository/user.repository.js';

export const treatmentRouter = Router();
const controller = new TreatmentController(
    TreatmentRepository.getInstance(),
    new UserRepository()
);
treatmentRouter.get('/', controller.getAll.bind(controller));
treatmentRouter.get('/:id', controller.get.bind(controller));
treatmentRouter.post('/create', controller.post.bind(controller));
treatmentRouter.patch(
    '/update/:id',
    logged,
    Authentication,
    controller.patch.bind(controller)
);
treatmentRouter.delete(
    '/delete/:id',
    logged,
    Authentication,
    controller.delete.bind(controller)
);
