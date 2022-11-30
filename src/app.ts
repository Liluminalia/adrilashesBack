import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setCors } from './middlewares/cors.js';
import { errorManager } from './middlewares/errors.js';
import { userRouter } from './router/user.router.js';
import { treatmentRouter } from './router/treatment.router.js';

export const app = express();
app.disable('x-powered-by');
const corsOptions = {
    origin: '*',
};
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use(setCors);

app.get('/', (req, res) => {
    res.send(
        'API de Adri lashes, esteticista, pon /treatments al final de la URL para ver los tratamientos que realiza'
    ).end();
});
app.use('/users', userRouter);
app.use('/treatments', treatmentRouter);
app.use(errorManager);
