import GenericController from "../generic";

export default class UserController extends GenericController {
    fastify: any;
    model: any;

    constructor(fastify, model) {
        super(fastify, model);

        this.login = this.login.bind(this);
        this.create = this.create.bind(this);
    }

    async create(request, reply) {
        /* 
            TODO: generate JWT token and send email with verification link
        */

        super.create(request, reply);
    }

    async verify(request, reply) {
        /* 
            TODO: 
        */
    }

    async login(request, reply) {
        try {
            const user = await this.model.findOne({ email: request.body.email });

            if (!user.active) {
                return reply.send(this.fastify.httpErrors.unauthorized('Email address has not been verified.'));
            }

            const valid = await user.comparePassword(request.body.password);

            if (valid) {
                return reply.code(201).send({
                    token: this.fastify.jwt.sign({
                        _id: user._id,
                        password: request.body.password
                        /* 
                            TODO: Add expiration date
                        */
                    })
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