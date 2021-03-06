import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId.js';

const Mutation = {
    async createUser(parent, args, { db }) {
      if(args.data.password.length < 6) {
        throw new Error("Password must be at least 6 characters length");
      }

      const emailTaken = db.users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const password = await bycrypt.hash(args.data.password, 10);

      const user = {
        id: new Date().getTime(),
        ...args.data,
        password
      };

      db.users.push(user);

      return {
        user,
        token: jwt.sign({id: user.id}, 'secret')
      }
    },
    async login(parent, args, { db }) {
      const user = db.users.find(user => user.email === args.data.email);

      if(!user) {
        throw new Error('Unable to login');
      }

      const isMatch = bycrypt.compare(args.data.password, user.password);

      if(!isMatch) {
        throw new Error('Unable to login');
      }

      return {
        user,
        token: jwt.sign({id: user.id}, 'secret')
      }
    },
    deleteUser(parent, args, { db }) {
        const id = args.id;
        const user = db.users.find(user => user.id === id);

        if(!user) {
            throw new Error(`Cannot find user with ID: ${id}`)
        }

        db.users = db.users.filter(user => user.id !== id);
        db.posts = db.posts.filter(post => {
            const match = post.userId === id;
            if(match) {
                db.comments = db.comments.filter(comment => comment.postId !== post.id);
            }
            return !match;
        });

        db.comments = db.comments.filter(comment => comment.userId !== id);

        return user;
    },
    updateUser(parent, {id, data: { email, age, name }}, { db }) {
      const user = db.users.find(user => user.id === id);
      if(!user) {
        throw new Error(`User with ID of ${id} not found`)
      }

      if(typeof email === 'string') {
        const emailTaken = db.users.some(user => user.email.toLowerCase() === email.toLowerCase());
        if(emailTaken) {
          throw new Error(`Email taken`)
        }

        user.email = email;
      }

      if(typeof email === 'name') { 
        user.name = name;
      }

      if(typeof age === 'number') { 
        user.age = age;
      }

      return user;
    },
    createComment(parent, { data }, { db, pubsub, request }) {
      const userId = getUserId(request);

      const user = db.users.find(user => user.id === userId);
      const post = db.posts.find(post => post.id === data.postId);

      if(user && post ) {
        const comment = {
          id: new Date().getTime().toString(),
          userId: data.userId,
          postId: data.postId,
          title: data.title
        }

        db.comments.push(comment);
        pubsub.publish(`comment_${data.postId}`, 
        { 
          comment: {
            type: "CREATED",
            comment
          } 
        });
        return comment;
      }

      throw new Error('Could not find user or post');
    }
  };

  export { Mutation as default }