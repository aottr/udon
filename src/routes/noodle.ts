import {
    FastifyInstance,
    FastifyReply
} from 'fastify';

import ImageRoute from './image';
import { IDb } from '../plugins/database';
import { INoodleAttrs } from '../models/noodleModel';

declare module 'fastify' {
    export interface FastifyInstance {
        db: IDb;
    }
}

interface INoodleParams {
    noodleId: string;
}

const NoodleRoute = async (fastify: FastifyInstance) => {

    fastify.get('/', async (request, reply: FastifyReply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodles = await Noodle.find({});
            reply.code(200).send({
                data: noodles,
                statusCode: 200
            });
        }
        catch (err) {
            request.log.error(err);
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    });

    fastify.post('/', async (request, reply: FastifyReply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodle = new Noodle(request.body);
            await noodle.save();
            reply.code(200).send({
                data: noodle,
                statusCode: 201
            });
        }
        catch (err: any) {
            request.log.error(err);
            if (err.code === 11000) {
                return reply.code(400).send({
                    message: 'Noodle already exists',
                    error: "Alread Exists",
                    statusCode: 400,
                });
            }
            reply.code(500).send({
                statusCode: 500,
                message: 'Internal Server Error'
            });
        }
    });

    fastify.get<{ Params: INoodleParams }>('/:noodleId', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodle = await Noodle.findOne({ name: request.params.noodleId });
            if (!noodle) {
                return reply.callNotFound();
            }
            reply.code(200).send({
                data: noodle,
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

    fastify.put<{ Params: INoodleParams, Body: INoodleAttrs }>('/:noodleId', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodle = await Noodle.findOne({ name: request.params.noodleId });
            if (!noodle) {
                return reply.callNotFound();
            }
            const updatedNoodle = await Noodle.findOneAndUpdate({ name: request.params.noodleId }, request.body, { new: true });
            reply.code(200).send({
                data: updatedNoodle,
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

    fastify.delete<{ Params: INoodleParams }>('/:noodleId', async (request, reply) => {

        try {
            const { Noodle } = fastify.db.models;
            const noodle = await Noodle.findOneAndDelete({ name: request.params.noodleId });
            if (!noodle) {
                return reply.callNotFound();
            }
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

    fastify.register(ImageRoute, { prefix: '/:noodleId/image' });
};

export default NoodleRoute;
