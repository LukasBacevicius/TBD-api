import GenericController from "../generic";
import * as moment from 'moment';
import * as config from 'config';
import { decode } from "punycode";

export default class UserController extends GenericController {
    fastify: any;
    model: any;

    constructor(fastify, model) {
        super(fastify, model);

        this.login = this.login.bind(this);
        this.create = this.create.bind(this);
        this.verify = this.verify.bind(this);
        this.resendVerification = this.resendVerification.bind(this);
        this.logout = this.logout.bind(this);
    }

    async sendVerificationMail(_id, to) {
        const token = this.fastify.jwt.sign({
            _id,
            exp: moment().utc().add({ days: 1 }).unix()
        })

        return await this.fastify.sendgrid.send({
            to,
            from: 'test@tbd.com',
            subject: 'Verify your email',
            html: `<a href="${config.get('uiUrl')}/verify?token=${token}">Verify your email</a>`
        });
    }

    async create(request, reply) {
        try {
            const result = await this.model.create(request.body);

            await this.sendVerificationMail(result._id, result.email);

            /* Make sure that `active` property has not been changed */
            request.body.active = false;

            return reply.code(201).send(result);
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async verify(request, reply) {
        try {
            if (!request.query.token) {
                new Error('Missing token');
            }

            this.fastify.jwt.verify(request.query.token, async (error, decoded) => {
                try {
                    if (error) {
                        throw new Error(error);
                    }

                    const user = await this.model.findByIdAndUpdate(decoded._id, { active: true }, { new: true });

                    return reply.code(200).send(user);
                } catch (error) {
                    return reply.code(400).send(error);
                }
            });

        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async resendVerification(request, reply) {
        try {
            if (!request.body.token) {
                new Error('Missing token');
            }

            const decoded = await this.fastify.jwt.decode(request.body.token);

            const { email, active } = await this.model.findById(decoded._id);

            if (active) {
                throw new Error('Email is already verified');
            }

            await this.sendVerificationMail(decoded._id, email);

            return reply.code(200).send({ "message": "OK" });
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async logout(request, reply) {
        try {
            request.destroySession((error) => {
                if (error) {
                    return reply.code(500).send(error);
                }
            });
            
            return reply.code(200).send({ message: "Logged out" });
        } catch (error) {
            request.log.error(error);
            return reply.code(400).send(error);
        }
    }

    async login(request, reply) {
        try {
            const user = await this.model.findOne({ email: request.body.email });

            if (!user.active) {
                return reply.send(this.fastify.httpErrors.unauthorized('Email address has not been verified.'));
            }

            const valid = await user.comparePassword(request.body.password);

            if (valid) {
                request.session.authenticated = valid;
                request.session.credentials = {
                    _id: user._id,
                    roles: user.roles
                };

                return reply.code(201).send({
                    token: this.fastify.jwt.sign({
                        _id: user._id,
                        password: request.body.password,
                        exp: moment().utc().add({ days: 7 }).unix()
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