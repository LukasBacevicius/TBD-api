import * as fastify from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import userRoutes from ".";

describe("/user", () => {
  let server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;

  beforeAll(() => { });

  beforeEach(async () => {
    server = fastify({});
    // eslint-disable-next-line global-require
    server.register(userRoutes);
    await server.ready();

    jest.clearAllMocks();
  });

  it("POST returns 200", async done => {
    const response = await server.inject({ method: "POST", url: "/user", payload: { name: 'test', email: 'test@test.com' } });
    expect(response.statusCode).toEqual(200);
    done();
  });
});