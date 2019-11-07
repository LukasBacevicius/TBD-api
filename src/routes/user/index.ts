import * as fp from "fastify-plugin";
import acl from '../../helpers/acl';
import UserController from '../../controllers/user';

export default fp(async (server, opts, next) => {
    const User = new UserController(server, server.db.models.User);

    server.post('/login', User.login);
    server.post('/user', {}, User.create);
    server.get('/verify', User.verify);
    server.post('/resendVerification', User.resendVerification);

    server.register((scope, opts, next) => {
        scope.register(
            acl,
            { allowedRoles: ['user'] }
        );

        scope.get('/logout', User.logout);

        /* Change to get the id from the session */
        scope.get('/user/:_id', {}, User.findOne);
        scope.patch('/user/:_id', {}, User.update);

        next();
    });

    next();
});