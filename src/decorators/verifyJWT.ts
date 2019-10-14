import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
    server.decorate('verifyJWT', async function (request, reply, done) {
        //server.assert(request.body && request.body.failureWithReply, 401);
        if (!request.headers.authorization) {
            return done(new Error('Missing token header'));
        }

        server.jwt.verify(request.headers.authorization, async (error, decoded) => {
            if (error || !decoded._id || !decoded.password) {
                return done(new Error('Token not valid'))
            }

            const user = await server.db.models.User.findById({ _id: decoded._id });

            const valid = await user.comparePassword(decoded.password);

            server.assert(valid, 401);

            request.headers['x-email'] = user.email;
        });
    });
});
