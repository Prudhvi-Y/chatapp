import { MyContext } from "src/types";
import { Ctx, Query, Resolver } from "type-graphql";
import { PostResponse } from "./postss";

@Resolver()
export class PostResolver {
    @Query(() => PostResponse)
    async posts(
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse> {
        const alltitles = await prisma.post.findFirst({
            where: {id: 1},
        });
        console.log(alltitles);

        return {
            posts: alltitles
        };
    }
}