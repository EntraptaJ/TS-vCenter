// src/API/index.ts
// Kristian Jones <me@kristianjones.xyz>
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { getResolvers } from './loader';

export const buildAPISchema = async (): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: await getResolvers(),
  });
