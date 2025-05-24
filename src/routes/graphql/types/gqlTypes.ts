import { PrismaClient } from '@prisma/client';

import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';

import { UUIDType } from './uuid.js';
import {
  MemberBaseType,
  MemberIdBaseType,
  PostBaseType,
  ProfileBaseType,
  UserBaseType,
} from './types.js';

const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: { value: 'BASIC' },
    BUSINESS: { value: 'BUSINESS' },
  },
});

const MemberType = new GraphQLObjectType<MemberBaseType>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeId) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

const Profile = new GraphQLObjectType<ProfileBaseType>({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberTypeId: { type: MemberTypeId },
    memberType: {
      type: MemberType,
      resolve: async (parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).memberType.findUnique({
          where: { id: parent.memberTypeId },
        });

        return result;
      },
    },
  }),
});

const Post = new GraphQLObjectType<PostBaseType>({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const User = new GraphQLObjectType<UserBaseType>({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: Profile,
      resolve: async (parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).profile.findUnique({
          where: { userId: parent.id },
        });
        return result;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).post.findMany({
          where: { authorId: parent.id },
        });
        return result;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (parent, _args, { prisma }) => {
        const subscriptions = await (prisma as PrismaClient).user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });

        return subscriptions || [];
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (parent, _args, { prisma }) => {
        const subscribers = await (prisma as PrismaClient).user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
        return subscribers || [];
      },
    },
  }),
}) as unknown as GraphQLObjectType<UserBaseType>;

export const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve: async (_parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).memberType.findMany();
        return result;
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberTypeId) } },
      resolve: async (_parent, { id }: { id: MemberIdBaseType }, { prisma }) => {
        const result = await (prisma as PrismaClient).memberType.findUnique({
          where: { id },
        });
        return result;
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(User))),
      resolve: async (_parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).user.findMany();
        return result;
      },
    },
    user: {
      type: User,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, { prisma }) => {
        const result = await (prisma as PrismaClient).user.findUnique({
          where: { id },
        });
        return result;
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Post))),
      resolve: async (_parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).post.findMany();
        return result;
      },
    },
    post: {
      type: Post,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, { prisma }) => {
        const result = await (prisma as PrismaClient).post.findUnique({
          where: { id },
        });
        return result;
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Profile))),
      resolve: async (_parent, _args, { prisma }) => {
        const result = await (prisma as PrismaClient).profile.findMany();
        return result;
      },
    },
    profile: {
      type: Profile,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve: async (_parent, { id }: { id: string }, { prisma }) => {
        const result = await (prisma as PrismaClient).profile.findUnique({
          where: { id },
        });
        return result;
      },
    },
  }),
});
