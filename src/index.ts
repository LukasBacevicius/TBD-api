import * as fastify from "fastify";
import * as fastifyBlipp from "fastify-blipp";
import { Server, IncomingMessage, ServerResponse } from "http";
import userRoutes from "./modules/routes/user";
import db from "./db";

const server: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
> = fastify();

server.register(db, { uri: "mongodb://localhost:27017/tbd" });
server.register(fastifyBlipp);
server.register(userRoutes);

const start = async () => {
    try {
        await server.listen(3000, "0.0.0.0");
        server.blipp();
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

process.on("uncaughtException", error => {
    console.error(error);
});
process.on("unhandledRejection", error => {
    console.error(error);
});

start();