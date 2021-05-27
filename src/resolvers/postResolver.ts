import { MyContext } from "src/types";
import { Ctx, Query, Resolver } from "type-graphql";
import { PostResponse } from "../reponses/posts";

@Resolver()
export class PostResolver {
    @Query(() => PostResponse)
    async posts(
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse | null> {

        const alltitles = await prisma.post.findMany();
        console.log(alltitles);

        if (alltitles){
            return {
                posts: alltitles,
            };
        } else {
            return {
                posts: null,
            };
        }
    }
}