const User = {
  email(parent, args, { db })  {
    // Data at parent comes from the parent resolver
    return parent.email;
  },
  posts(parent, args, { db }) {
    return db.posts.filter((post) => post.userId === parent.id);
  },
  comments(parent, args, { db }) {
    return db.comments.filter((comment) => comment.userId === parent.id);
  },
};

export { User as default };
