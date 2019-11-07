import * as fastifyAcl from 'fastify-acl-auth';

export default fastifyAcl({
    /* This is temporary */
    hierarchy: ['user', 'superuser', 'admin']
})