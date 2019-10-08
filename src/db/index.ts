import { Model } from "mongoose";
import * as Mongoose from "mongoose";
import { UserModel, User } from "./models/user";

import * as fp from "fastify-plugin";

export interface Models {
    User: Model<UserModel>;
}

export interface Db {
    models: Models;
}

export default fp(async (fastify, opts: { uri: string }, next) => {
    Mongoose.connection.on("connected", () => {
        fastify.log.info({ actor: "MongoDB" }, "connected");
    });

    Mongoose.connection.on("disconnected", () => {
        fastify.log.error({ actor: "MongoDB" }, "disconnected");
    });

    // @ts-ignore
    await Mongoose.connect(
        opts.uri,
        {
            useNewUrlParser: true,
            keepAlive: 1,
            useUnifiedTopology: true
        }
    );

    const models: Models = {
        User
    };

    fastify.decorate("db", { models });

    next();
});