const Query = {
  users(parent, args, { db }) {
    if (!args.query) {
      return db.users;
    }

    return db.users.filter((user) =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },
  posts(parent, args, { db }) {
    return db.posts;
  },
  comments(parent, args, { db }) {
    return db.comments;
  },
};

export { Query as default }
