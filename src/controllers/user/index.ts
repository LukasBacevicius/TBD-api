import GenericController from "../generic";

export default class UserController extends GenericController {
    fastify: any;
    model: any;

    constructor(fastify, model) {
        super(fastify, model);

        this.create = this.create.bind(this);
    }


    async create(request, reply) {
        try {
            const { email, password } = request.body;

            request.body.password = await this.fastify.bcrypt.hash(password, 10);

            const result = await this.model.create(request.body);
            
            return reply.code(201).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }
}