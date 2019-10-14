import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
    server.route({
        method: 'GET',
        url: '/status',
        preHandler: server.auth([server.verifyJWT]),
        handler: async (request, reply) => {
            return reply.code(201).send({ 'message': 'OK' });
        },
    });

    next();
});