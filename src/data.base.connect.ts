import mongoose from 'mongoose';
import { USER, CLUSTER, PASSW } from './config.js';
export function dataBaseConnect() {
    const DBName =
        process.env.NODE_ENV !== 'test' ? 'saraData' : 'CodersTesting';
    let uri = `mongodb+srv://${USER}:${PASSW}`;
    uri += `@${CLUSTER}/${DBName}?retryWrites=true&w=majority`;
    return mongoose.connect(uri);
}
