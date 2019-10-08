
export default class GenericController {
    model: any;

    constructor(server: any) {
        this.model = server;

        this.findOne = this.findOne.bind(this);
        this.create = this.create.bind(this);
    }

    async findOne(request, reply) {
        try {
            const _id = request.params.id;
            console.log(this.model);
            const user = await this.model.findOne({
                _id
            });

            if (!user) {
                return reply.send(404);
            }

            return reply.code(200).send(user);
        } catch (error) {
            request.log.error(error);
            return reply.send(400);
        }
    }

    async create(request, reply) {
        try {
            console.log(this.model);
            const result = await this.model.create(request.body);
            return reply.code(201).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.send(500);
        }
    }
}