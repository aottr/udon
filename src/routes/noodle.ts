import {
    FastifyInstance,
    FastifyReply
} from 'fastify';

import ImageRoute from './image';

interface INoodleParams {
    noodleId: string;
}

const NoodleRoute = async (fastify: FastifyInstance) => {

    fastify.get('/', async (request, reply: FastifyReply) => {
        reply.code(200).send({
            data: [],
            statusCode: 200
        });
    })

    fastify.get<{ Params: INoodleParams }>('/:noodleId', async (request, reply) => {

        if (request.params.noodleId !== 'ott') {
            return reply.callNotFound();
        }
        reply.code(200).send({
            data: {
                id: request.params.noodleId,
                name: 'Otter',
                entries: 1000
            },
            statusCode: 200
        });
    })

    fastify.register(ImageRoute, { prefix: '/:noodleId/image' });
};

export default NoodleRoute;
