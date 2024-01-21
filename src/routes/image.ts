import {
    FastifyInstance,
    FastifyReply
} from 'fastify';
import { IDb } from '../plugins/database';
import { IPaginationQuery } from './noodle';
import { IImageAttrs } from '../models/noodle';

declare module 'fastify' {
    export interface FastifyInstance {
        db: IDb;
    }
}

interface INoodleParams {
    noodleId: string;
}

interface IImageParams {
    imageId: string;
}

const ImageRoute = async (fastify: FastifyInstance) => {

    fastify.get<{ Params: INoodleParams; Querystring: IPaginationQuery }>('/', async (request, reply: FastifyReply) => {
        try {
            const { Noodle } = fastify.db.models;
            const page = parseInt(request.query.page || '1', 10);
            const limit = parseInt(request.query.limit || '50', 10);
            const skip = (page - 1) * limit;
            const noodle = await Noodle.findOne({ name: request.params.noodleId }, { images: { $slice: [skip, limit] } }).select(['name', 'description', '-_id']);
            if (!noodle) {
                return reply.callNotFound();
            }
            reply.code(200).send({
                data: noodle,
                page,
                limit,
                statusCode: 200
            });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    })

    fastify.get<{ Params: INoodleParams & IImageParams }>('/:imageId', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodle = await Noodle.findOne({ name: request.params.noodleId }, { images: { $elemMatch: { _id: request.params.imageId } } }).select(['name', 'description', '-_id']);
            if (!noodle) {
                return reply.callNotFound();
            }
            if (!noodle.images.length) {
                return reply.callNotFound();
            }
            reply.code(200).send({
                data: noodle.images[0],
                statusCode: 200
            });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    });

    fastify.post<{ Params: INoodleParams; Body: IImageAttrs }>('/', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodle = await Noodle.findOne({ name: request.params.noodleId });
            if (!noodle) {
                return reply.callNotFound();
            }
            const image = request.body;
            await noodle.addImage(image);
            reply.code(200).send({
                data: image,
                statusCode: 200
            });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    });

    fastify.delete<{ Params: INoodleParams & IImageParams }>('/:imageId', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            await Noodle.updateOne({ name: request.params.noodleId }, {
                $pull: {
                    images: { _id: request.params.imageId }
                }
            });
            reply.code(200).send({
                statusCode: 200
            });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    });

    fastify.put<{ Params: INoodleParams & IImageParams; Body: IImageAttrs }>('/:imageId', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            await Noodle.updateOne({ name: request.params.noodleId, 'images._id': request.params.imageId }, {
                $set: {
                    'images.$': request.body
                }
            });
            reply.code(200).send({
                statusCode: 200
            });
        } catch (err) {
            request.log.error(err);
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    });
};

export default ImageRoute;
