import * as fp from "fastify-plugin";
import UserController from '../../controllers/user';

export default fp(async (server, opts, next) => {
    const User = new UserController(server.db.models.User);

    server.get("/users/:id", {}, User.findOne);
    server.post("/users", {}, User.create);

    next();
});