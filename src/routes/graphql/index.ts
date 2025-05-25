import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema } from 'graphql';

import { RootQueryType } from './types/gqlTypes.js';
import { Mutations } from './types/mutations.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { body } = req;

      return graphql({
        schema: new GraphQLSchema({
          query: RootQueryType,
          mutation: Mutations,
        }),
        source: body.query,
        variableValues: body.variables,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
