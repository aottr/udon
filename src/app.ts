import fastify from 'fastify';
import pino from 'pino';
require('dotenv').config();

import NoodleRoutes from './routes/noodle';
import database from './plugins/database';

const log = pino({ level: 'info' })
const port = parseInt(process.env.PORT || '7000');
const uri = process.env.MONGODB_URI || '';

const server = fastify({
    logger: log
});
server.register(database, { uri });
server.register(NoodleRoutes, { prefix: '/v1/noodle' });

server.listen({ port }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    log.info(`udon API has been started.`)
})
