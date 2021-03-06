
export default class GenericController {
    fastify: any;
    model: any;

    constructor(fastify, model: any) {
        this.model = model;
        this.fastify = fastify;

        this.findOne = this.findOne.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
    }

    async findOne(request, reply) {
        try {
            const { _id } = request.params;
            const result = await this.model.findOne({
                _id
            });

            if (!result) {
                return reply.send(404);
            }

            return reply.code(200).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async update(request, reply) {
        try {
            const { _id } = request.params;
            const result = await this.model.findByIdAndUpdate(_id, request.body, { new: true });

            return reply.code(200).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async create(request, reply) {
        try {
            const result = await this.model.create(request.body);
            return reply.code(201).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }
}