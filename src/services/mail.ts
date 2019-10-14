import * as sendgrid from "@sendgrid/mail";
import * as config from "config";
import * as fp from "fastify-plugin";

export default fp(async (server, opts, next) => {
    const sendgridInstance = sendgrid;

    sendgridInstance.setApiKey(config.get('sendgrid'));
    server.decorate('sendgrid', sendgridInstance);

    next();
});