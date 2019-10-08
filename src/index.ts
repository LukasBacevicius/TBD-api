import * as fastify from "fastify";
import * as fastifyBlipp from "fastify-blipp";
import { Server, IncomingMessage, ServerResponse } from "http";
import * as config from "config";
import * as Routes from "./modules/routes";
import db from "./db";

const server: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
> = fastify();

server.register(db, config.get('db'));
server.register(fastifyBlipp);

Object.keys(Routes).map(route => server.register(Routes[route]));

process.on("uncaughtException", error => {
    console.error(error);
});
process.on("unhandledRejection", error => {
    console.error(error);
});

(async () => {
    try {
        await server.listen(3000, "0.0.0.0");
        server.blipp();
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
})();