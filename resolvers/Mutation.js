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
    }
  };

  export { Mutation as default }