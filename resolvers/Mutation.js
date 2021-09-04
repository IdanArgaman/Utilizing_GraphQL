const Mutation = {
    createUser(parent, args, { db }) {
      const emailTaken = db.users.some((user) => user.email === args.data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: new Date().getTime(),
        ...args.data,
      };

      db.users.push(user);

      return user;
    },
    deleteUser(parenet, args, { db }) {
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
    createComment(parenet, { data }, { db, pubsub }) {
      const user = db.users.find(user => user.id === data.userId);
      const post = db.posts.find(post => post.id === data.postId);

      if(user && post ) {
        const comment = {
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