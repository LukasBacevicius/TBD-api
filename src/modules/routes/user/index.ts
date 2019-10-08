import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
    server.get("/users/:id", {}, async (request, reply) => {
        try {
            const _id = request.params.id;

            const user = await server.db.models.User.findOne({
                _id
            });

            if (!user) {
                return reply.send(404);
            }

            return reply.code(200).send(user);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    });

    server.post("/users", {}, async (request, reply) => {
        try {
            const { User } = server.db.models;
            
            const user = await User.create(request.body);

            return reply.code(201).send(user);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    });
    next();
});