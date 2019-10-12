import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {

    server.addHook('onSend', async (request, reply, payload, done) => {
        const {
            password,
            __v,
            ...rest } = JSON.parse(payload);
            
            return JSON.stringify(rest);
    });

    next();
});