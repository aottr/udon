import fastify from 'fastify';
import pino from 'pino';

import NoodleRoutes from './routes/noodleRoute';

const log = pino({ level: 'info' })
const port = parseInt(process.env.PORT || '7000');

const server = fastify({
    logger: log
});

server.register(NoodleRoutes, { prefix: '/v1/noodle' });

server.listen({ port }, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    log.info(`udon API has been started.`)
})
