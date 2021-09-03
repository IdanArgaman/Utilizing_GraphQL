const Post = {
  author(parent, args, { db }) {
    return db.users.find((user) => user.id === parent.userId);
  },
  comments(parent, args, { db }) {
    return db.comments.filter((comment) => comment.postId === parent.id);
  },
};

export { Post as default }