import {
    FastifyInstance,
    FastifyReply
} from 'fastify';

interface INoodleParams {
    noodleId: string;
}

interface IImageParams {
    imageId: string;
}

const ImageRoute = async (fastify: FastifyInstance) => {

    fastify.get<{ Params: INoodleParams }>('/', async (request, reply: FastifyReply) => {
        reply.code(200).send({
            data: [],
            statusCode: 200
        });
    })

    fastify.get<{ Params: INoodleParams & IImageParams }>('/:imageId', async (request, reply) => {

        if (request.params.noodleId !== 'ott') {
            return reply.callNotFound();
        }
        reply.code(200).send({
            data: {
                id: request.params.imageId,
                name: 'Otter',
                entries: 1000
            },
            statusCode: 200
        });
    })
};

export default ImageRoute;
