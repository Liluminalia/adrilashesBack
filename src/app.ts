import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { setCors } from './middlewares/cors';
import { errorManager } from './middlewares/errors';
import { userRouter } from './router/user.router';
import { treatmentRouter } from './router/treatment.router';

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
app.use('/treatments', treatmentRouter);
app.use('/users', userRouter);
app.use(errorManager);
