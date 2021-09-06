import { GraphQLServer, PubSub } from "graphql-yoga";
import db from './db.js';

import Query from './resolvers/Query.js';
import Mutation from './resolvers/Mutation.js';
import Subscription from './resolvers/Subscription.js';
import Post from './resolvers/Post.js';
import User from './resolvers/User.js';
import Comment from './resolvers/Comment.js';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context(request) {
    return {
      db,
      pubsub,
      request
    }
  }
});

server.start(() => {
  console.log("The server is up!");
});
