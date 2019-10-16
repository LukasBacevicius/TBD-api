import * as fp from "fastify-plugin";
import UserController from '../../controllers/user';

export default fp(async (server, opts, next) => {
    const User = new UserController(server, server.db.models.User);

    server.post('/login', User.login);
    server.get('/logout', User.logout);
    server.get('/verify', User.verify);
    server.post('/resendVerification', User.resendVerification);

    server.post('/user', {}, User.create);
    server.get('/user/:_id', {}, User.findOne);
    server.patch('/user/:_id', {}, User.update);

    next();
});