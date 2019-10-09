import * as fp from "fastify-plugin";
import UserController from '../../controllers/user';

export default fp(async (server, opts, next) => {
    const User = new UserController(server.db.models.User);

    server.get('/users/:_id', {}, User.findOne);
    server.patch('/users/:_id', {}, User.update);
    server.post('/users', {}, User.create);

    next();
});