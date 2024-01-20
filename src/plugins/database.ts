import { FastifyInstance } from 'fastify';
import { FastifyPluginAsync, FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';
import pino from 'pino';

import { Noodle, INoodleModel } from '../models/noodleModel';

const log = pino({ level: 'info' })

export interface IModels {
    Noodle: INoodleModel;
}

export interface IDb {
    models: IModels;
}

export interface IDbPluginOptions extends FastifyPluginOptions {
    uri: string;
}

const ConnectDB: FastifyPluginAsync<IDbPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {
    try {
        mongoose.connection.on('connected', () => {
            fastify.log.info({ actor: 'MongoDB' }, 'connected');
        });
        mongoose.connection.on('disconnected', () => {
            fastify.log.error({ actor: 'MongoDB' }, 'disconnected');
        });
        await mongoose.connect(options.uri);

        const models: IModels = { Noodle };
        fastify.decorate('db', { models });
    } catch (error) {
        log.error(error);
    }
};
export default fp(ConnectDB);
