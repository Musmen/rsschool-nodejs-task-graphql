import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { RootQueryType } from './types/gqlTypes.js';
import { Mutations } from './types/mutations.js';

const QUERY_DEPTH_LIMIT = 5;

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

      const schema = new GraphQLSchema({
        query: RootQueryType,
        mutation: Mutations,
      });

      const parsedQuery = parse(body.query);
      const validationRules = [depthLimit(QUERY_DEPTH_LIMIT)];

      try {
        const validationErrors = validate(schema, parsedQuery, validationRules);
        if (validationErrors.length > 0) {
          return { errors: validationErrors };
        }

        return await graphql({
          schema,
          source: body.query,
          variableValues: body.variables,
          contextValue: { prisma },
        });
      } catch (error) {
        fastify.log.error(error);
        return { errors: [error] };
      }
    },
  });
};

export default plugin;
