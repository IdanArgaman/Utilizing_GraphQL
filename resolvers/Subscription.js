const Subscription = {
    // count is name we chose in at the schema
    count: {
        subscribe(parent, args, { pubsub }, info) {
            let c = 0;

            setInterval(() => {
                c++;
                // Channel name is arbitrary, we can choose any name
                pubsub.publish('XXX', {
                    count: c    // We must use the name we chose at the schema
                })
            }, 1000)

            // But we must use the same name here!
            return pubsub.asyncIterator('XXX')
        }
    },
    comment: {
        subscribe(parent, { postId }, { db, pubsub }, info) {
            const post = db.posts.find(post => post.id === postId);
            if(!post) {
                throw new Error("Post wasn't found")
            }
            return pubsub.asyncIterator(`comment_${postId}`);
        }
    }
}

export { Subscription as default }