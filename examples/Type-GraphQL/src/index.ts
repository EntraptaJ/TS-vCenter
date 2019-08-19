// src/index.ts
// Kristian Jones <me@kristianjones.xyz>
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import jwt from 'express-jwt';
import { buildAPISchema } from './API';
import { vCenter } from 'ts-vcenter';

const Startup = async (): Promise<void> => {
  const schema = await buildAPISchema();

  const expressApp = express();

  const API = new ApolloServer({
    introspection: true,
    schema,
    context: async ctx => ({
      vcsa: ctx.req.user ? new vCenter({ url: ctx.req.user.url, token: ctx.req.user.token }) : undefined,
    }),
  });

  expressApp.use(jwt({ secret: 'SECRET', credentialsRequired: false }));

  API.applyMiddleware({ app: expressApp });

  // Start the server
  await expressApp.listen(80);
  console.log('server listening');
};

Startup();
