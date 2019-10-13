import GenericController from "../generic";

export default class UserController extends GenericController {
    fastify: any;
    model: any;

    constructor(fastify, model) {
        super(fastify, model);

        this.login = this.login.bind(this);
    }

    async login(request, reply) {
        try {
            const user = await this.model.findOne({ email: request.body.email });

            if (!user.active) {
                return reply.send(this.fastify.httpErrors.unauthorized('Email address has not been verified.'));
            }

            const valid = await user.comparePassword(request.body.password);

            if (valid) {
                /* 
                    this.fastify.jwt.sing({ 
                            email: user.email,
                            password: request.body.password
                        })
                */
                return reply.code(201).send({
                    token: 'Basic ' + Buffer.from(`${user.email}:${request.body.password}`).toString('base64')
                })
            }

            return reply.send(this.fastify.httpErrors.unauthorized('Email or password is incorrect'));
        }
        catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }
}