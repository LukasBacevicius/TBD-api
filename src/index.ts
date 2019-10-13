import * as fastify from "fastify";
import * as fastifyBlipp from "fastify-blipp";
import * as sensible from 'fastify-sensible';
import * as basicAuth from 'fastify-basic-auth';
import * as jwt from 'fastify-jwt' 
import * as config from "config";
import { Server, IncomingMessage, ServerResponse } from "http";
import * as Routes from "./routes";
import * as Hooks from './hooks';
import validate from './helpers/validateAuth';
import objectImports from './helpers/objectImports';

import db from "./db";

const server: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
> = fastify();

server.register(db, config.get('db'));
server.register(sensible);
server.register(jwt, {
    secret: config.get('jwt')
  })
server.register(fastifyBlipp);
server.register(basicAuth, { validate });
objectImports(Routes, server.register);
objectImports(Hooks, server.register);

process.on("uncaughtException", error => {
    console.error(error);
});
process.on("unhandledRejection", error => {
    console.error(error);
});

(async () => {
    try {
        await server.listen(5000, "0.0.0.0");
        server.blipp();
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();