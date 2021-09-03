import { GraphQLServer } from 'graphql-yoga';

const users = [{
    id: 1,
    name: 'Idan',
    email: 'IdanArgaman@gmail.com',
    age: 29
},
{
    id: 2,
    name: 'John',
    email: 'john@gmail.com',
}];

const posts = [{
    id: 1,
    title: 'Honey',
    body: 'Honey moon',
    published: true,
    userId: 1
},
{
    id: 2,
    title: 'Gold',
    body: 'Better than silver',
    published: false,
    userId: 2
}];

const comments = [{
    id: 1,
    title: 'Idan comment!',
    body: 'Hi',
    userId: 1,
    postId: 1
},
{
    id: 2,
    title: 'John comment!',
    body: 'Bye',
    userId: 2,
    postId: 2
}];

const typeDefs = `
    type Query {
        me: User!
        users(query: String): [User!]!
        posts: [Post!]!
        comments: [Comment!]!
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
`

const resolvers = {
    Query: {
        users(parent, args) {
            if(!args.query) {
                return users;
            }

            return users.filter(user => user.name.toLowerCase().includes(args.query.toLowerCase()));
           
        },
        posts(parent, args) {
            return posts;
        },
        comments() {
            return comments;
        }
    },
    Post: {
        author(parent, args) {
            return users.find(user => user.id === parent.userId);
        },
        comments(parent, args) {
            return comments.filter(comment => comment.postId === parent.id);
        }
    },
    User: {
        posts(parent, args) {
            return posts.filter(post => post.userId === parent.id);
        },
        comments(parent, args) {
            return comments.filter(comment => comment.userId === parent.id);
        }
    },
    Comment: {
        post(parent, args) {
            return posts.find(post => post.id === parent.postId);
        },
        author(parent, args) {
            return users.find(user => user.id === parent.userId);
        },
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('The server is up!')
});