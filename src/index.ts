import http from 'http';
import { app } from './app.js';
import debugCreator from 'debug';
import { CustomError } from './interfaces/error.js';
import { dataBaseConnect } from './data.base.connect.js';

const debug = debugCreator('http');
const port = process.env.PORT || 3300;
const server = http.createServer(app);
server.on('listening', () => {
    const addr = server.address();
    if (addr === null) return;
    let bind: string;
    if (typeof addr === 'string') {
        bind = 'pipe ' + addr;
    } else {
        bind =
            addr.address === '::'
                ? `http://localhost:${addr?.port}`
                : `port ${addr?.port}`;
    }
    debug(`Listening on ${bind}`);
});

server.on('error', (error: CustomError, response: http.ServerResponse) => {
    response.statusCode = error?.statusCode;
    response.statusMessage = error?.statusMessage;
    response.write(error.message);
    response.end();
});
dataBaseConnect()
    .then((mongoose) => {
        debug('DB:', mongoose.connection.db.databaseName);
        server.listen(port);
    })
    .catch((error) => server.emit(error));
