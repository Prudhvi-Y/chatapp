import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { PostResponse } from "../reponses/posts";


@Resolver()
export class PostResolver {
    @Query(() => PostResponse)
    async posts(
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse | null> {

        const alltitles = await prisma.post.findMany();
        // console.log(alltitles);

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

    @Query(() => PostResponse)
    async singlepost(
        @Arg("id", () => Int) id: number,
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse | null> {

        const onepost = await prisma.post.findFirst({
            where: {
                id: id
            },
        });

        if (onepost) {
            return{
                posts: [onepost],
            };
        } else {
            return{
                posts: null,
            };
        }
        
    }

    @Mutation(() => PostResponse)
    async createpost (
        @Arg("title") title: string,
        @Arg("author") author: string,
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse | null> {

        const created = await prisma.post.create({
            data: {
                title: title,
                author: author,
            },
        });

        if (created) {
            return{
                posts: [created],
            };
        } else {
            return{
                posts: null,
            };
        }
    }

    @Mutation(() => PostResponse)
    async updatepost (
        @Arg("title") title: string,
        @Arg("author") author: string,
        @Arg("id", ()=>Int) id: number,
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse | null> {

        let updated;
        if (title) {
            updated = await prisma.post.update({
                where: {
                    id: id,
                },
                data: {
                    title: title,
                },
            });
        }

        if (author) {
            updated = await prisma.post.update({
                where: {
                    id: id,
                },
                data: {
                    author: author,
                },
            });
        }

        if (updated) {
            return{
                posts: [updated],
            };
        } else {
            return{
                posts: null,
            };
        }
    }

    @Mutation(() => PostResponse)
    async deletepost (
        @Arg("id", () => Int) id: number,
        @Ctx() {prisma}: MyContext
    ): Promise<PostResponse | null> {

        try {
            const deleted = await prisma.post.delete({
                where: {
                    id: id,
                },
            });

            
            return{
                posts: [deleted],
            };
        } catch {
            return{
                posts: null,
            };
        }
    }
}