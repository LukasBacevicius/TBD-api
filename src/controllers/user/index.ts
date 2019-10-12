import GenericController from "../generic";

export default class UserController extends GenericController {
    fastify: any;
    model: any;

    constructor(fastify, model) {
        super(fastify, model);

        this.create = this.create.bind(this);
        this.login = this.login.bind(this);
    }


    async create(request, reply) {
        try {
            const { password } = request.body;

            request.body.password = await this.fastify.bcrypt.hash(password, 10);

            const result = await this.model.create(request.body);

            return reply.code(201).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async login(request, reply) {
        try {
            const { password, email } = await this.model.findOne({ email: request.body.email });
            return this.fastify.bcrypt.compare(
                request.body.password,
                password,
                (error, valid) => {
                    if (valid) {
                        return reply.code(201).send({
                            token: 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64')
                        })
                    }

                    return reply.send(this.fastify.httpErrors.unauthorized('Email or password is incorrect'));
                }
            );
        }
        catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }
}