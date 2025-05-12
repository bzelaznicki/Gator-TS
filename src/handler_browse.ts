import { getPostsForUser } from "./lib/db/queries/posts";
import { User } from "./lib/db/schema";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    
    let argLimit: number = Number(args[0]);

    if (!argLimit) {
        argLimit = 2;
    }

    const posts = await getPostsForUser(user.id, argLimit);

    if (posts.length === 0) {
        console.log(`No new posts found for ${user.name}`);
        return;
    }

    for (const post of posts) {
        console.log(`- ${post.posts.title} (posted on ${post.posts.publishedAt}): ${post.posts.url}`);
        console.log("========================")
    }

}