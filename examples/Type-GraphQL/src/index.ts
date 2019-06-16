// src/index.ts
// Kristian Jones <me@kristianjones.xyz>
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildAPISchema } from './API';

const Startup = async (): Promise<void> => {
  const schema = await buildAPISchema();
  const API = new ApolloServer({ introspection: true, schema });
  await API.listen(80);
  console.log('API Listening');
};

Startup();
