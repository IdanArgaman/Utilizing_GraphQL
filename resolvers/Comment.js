const Comment = {
  post(parent, args, { db }) {
    return db.posts.find((post) => post.id === parent.postId);
  },
  author(parent, args, { db }) {
    return db.users.find((user) => user.id === parent.userId);
  },
};

export { Comment as default };
