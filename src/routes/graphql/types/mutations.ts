import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { MemberTypeId, Post, Profile, User } from './gqlTypes.js';
import { UUIDType } from './uuid.js';

const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
  },
});

const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

const ChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeId },
  },
});

const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const Mutations = new GraphQLObjectType({
  name: 'Mutations',
  fields: () => ({
    createUser: {
      type: new GraphQLNonNull(User),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInput) },
      },
      resolve: async (
        _parent,
        { dto }: { dto: { name: string; balance: number } },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).user.create({
          data: dto,
        });
        return result;
      },
    },
    createProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInput) },
      },
      resolve: async (
        _parent,
        {
          dto,
        }: {
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).profile.create({
          data: dto,
        });
        return result;
      },
    },
    createPost: {
      type: new GraphQLNonNull(Post),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInput) },
      },
      resolve: async (
        _parent,
        { dto }: { dto: { title: string; content: string; authorId: string } },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).post.create({
          data: dto,
        });
        return result;
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, { prisma }) => {
        const result = await (prisma as PrismaClient).user.delete({
          where: {
            id,
          },
        });
        return result.id;
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, { prisma }) => {
        const result = await (prisma as PrismaClient).post.delete({
          where: {
            id,
          },
        });
        return result.id;
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_parent, { id }: { id: string }, { prisma }) => {
        const result = await (prisma as PrismaClient).profile.delete({
          where: {
            id,
          },
        });
        return result.id;
      },
    },
    changePost: {
      type: new GraphQLNonNull(Post),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInput) },
      },
      resolve: async (
        _parent,
        {
          id,
          dto,
        }: { id: string; dto: { title: string; content: string; authorId: string } },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).post.update({
          where: { id },
          data: dto,
        });
        return result;
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(Profile),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInput) },
      },
      resolve: async (
        _parent,
        {
          id,
          dto,
        }: {
          id: string;
          dto: {
            isMale: boolean;
            yearOfBirth: number;
            userId: string;
            memberTypeId: string;
          };
        },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).profile.update({
          where: { id },
          data: dto,
        });
        return result;
      },
    },
    changeUser: {
      type: new GraphQLNonNull(User),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInput) },
      },
      resolve: async (
        _parent,
        { id, dto }: { id: string; dto: { name: string; balance: number } },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).user.update({
          where: { id },
          data: dto,
        });
        return result;
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).subscribersOnAuthors.create({
          data: {
            subscriberId: userId,
            authorId,
          },
        });

        return result.authorId;
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _parent,
        { userId, authorId }: { userId: string; authorId: string },
        { prisma },
      ) => {
        const result = await (prisma as PrismaClient).subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        return result.authorId;
      },
    },
  }),
});
