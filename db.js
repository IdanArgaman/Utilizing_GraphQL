let users = [
  {
    id: "1",
    name: "Idan",
    email: "IdanArgaman@gmail.com",
    age: 29,
  },
  {
    id: "2",
    name: "John",
    email: "john@gmail.com",
  },
];

let posts = [
  {
    id: "1",
    title: "Honey",
    body: "Honey moon",
    published: true,
    userId: "1",
  },
  {
    id: "2",
    title: "Gold",
    body: "Better than silver",
    published: false,
    userId: "2",
  },
];

let comments = [
  {
    id: "1",
    title: "Idan comment!",
    body: "Hi",
    userId: "1",
    postId: "1",
  },
  {
    id: "2",
    title: "John comment!",
    body: "Bye",
    userId: "2",
    postId: "2",
  },
];

const db = {
    users,
    posts,
    comments
}

export { db as default } 