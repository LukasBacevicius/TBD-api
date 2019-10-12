import * as fp from "fastify-plugin";
import UserController from '../../controllers/user';

export default fp(async (server, opts, next) => {
    const User = new UserController(server, server.db.models.User);

    server.get('/user/:_id', {}, User.findOne);
    server.patch('/user/:_id', {}, User.update);
    server.post('/user', {}, User.create);

    next();
});