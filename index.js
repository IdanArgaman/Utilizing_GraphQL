import { GraphQLServer } from "graphql-yoga";

let users = [
  {
    id: '1',
    name: "Idan",
    email: "IdanArgaman@gmail.com",
    age: 29,
  },
  {
    id: '2',
    name: "John",
    email: "john@gmail.com",
  },
];

let posts = [
  {
    id: '1',
    title: "Honey",
    body: "Honey moon",
    published: true,
    userId: '1',
  },
  {
    id: '2',
    title: "Gold",
    body: "Better than silver",
    published: false,
    userId: '2',
  },
];

let comments = [
  {
    id: '1',
    title: "Idan comment!",
    body: "Hi",
    userId: '1',
    postId: '1',
  },
  {
    id: '2',
    title: "John comment!",
    body: "Bye",
    userId: '2',
    postId: '2',
  },
];

const typeDefs = `
    type Query {
        me: User!
        users(query: String): [User!]!
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID
        title: String
        body: String
        published: Boolean
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID
        title: String
        author: User!
        post: Post!
    }
`;

const resolvers = {
  Query: {
    users(parent, args) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },
    posts(parent, args) {
      return posts;
    },
    comments() {
      return comments;
    },
  },
  Mutation: {
    createUser(parent, args) {
      const emailTaken = users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: new Date().getTime(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parenet, args) {
        const id = args.id;
        const user = users.find(user => user.id === id);

        if(!user) {
            throw new Error(`Cannot find user with ID: ${id}`)
        }

        users = users.filter(user => user.id !== id);
        posts = posts.filter(post => {
            const match = post.userId === id;
            if(match) {
                comments = comments.filter(comment => comment.postId !== post.id);
            }
            return !match;
        });
        comments = comments.filter(comment => comment.userId !== id);

        return user;
    }
  },
  Post: {
    author(parent, args) {
      return users.find((user) => user.id === parent.userId);
    },
    comments(parent, args) {
      return comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts(parent, args) {
      return posts.filter((post) => post.userId === parent.id);
    },
    comments(parent, args) {
      return comments.filter((comment) => comment.userId === parent.id);
    },
  },
  Comment: {
    post(parent, args) {
      return posts.find((post) => post.id === parent.postId);
    },
    author(parent, args) {
      return users.find((user) => user.id === parent.userId);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
