import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { PostResponse } from "../reponses/posts";
import { getUserId } from "../helpers/jwtUtil";


@Resolver()
export class PostResolver {
    @Query(() => PostResponse)
    async posts(
        @Ctx() {req, prisma}: MyContext
    ): Promise<PostResponse | null> {

        const user = getUserId(req);
        if (!user) {
            throw new Error('user not logged in!');
        } else {

            const userposts = await prisma.user.findFirst({
                where: {
                    id: user.id,
                },
                include: {
                    posts: true,
                },
            });
            const alltitles = userposts?.posts;
            // console.log(alltitles);

            if (alltitles){
                return {
                    posts: alltitles,
                };
            }
        }
        return {
            posts: null,
        };
    }

    @Query(() => PostResponse)
    async singlepost(
        @Arg("id", () => Int) id: number,
        @Ctx() {req, prisma}: MyContext
    ): Promise<PostResponse | null> {

        const user = getUserId(req);
        if (!user) {
            throw new Error('user not logged in!');
        } else {

            const userpost = await prisma.user.findFirst({
                where: {
                    id: user.id,
                },
                select: {
                    posts: {
                        where: {
                            id: id,
                        },
                    },
                },
            });

            const onepost = userpost?.posts;

            if (onepost) {
                return{
                    posts: onepost,
                };
            }
        }
        return{
            posts: null,
        };
        
    }

    @Mutation(() => PostResponse)
    async createpost (
        @Arg("content") content: string,
        @Ctx() {req, prisma}: MyContext
    ): Promise<PostResponse | null> {

        const user = getUserId(req);
        if (!user) {
            throw new Error('user not logged in!');
        } else {

            const created = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    posts: {
                        create: {
                            content: content,
                        },
                    },
                },
                select: {
                    posts: true,
                }
            })

            if (created) {
                return{
                    posts: created.posts,
                };
            }
        }
        
        return{
            posts: null,
        };
    }

    @Mutation(() => PostResponse)
    async updatepost (
        @Arg("content") content: string,
        @Arg("id", ()=>Int) id: number,
        @Ctx() {req, prisma}: MyContext
    ): Promise<PostResponse | null> {

        const user = getUserId(req);
        if (!user) {
            throw new Error('user not logged in!');
        } else {
            let updated;
            if (content) {

                updated = await prisma.user.update({
                    where: {
                        id: user.id,
                    },

                    data: {
                        posts: {
                            update: {
                                where: {
                                    id: id,
                                },
                                data: {
                                    content: content,
                                },
                            },
                        },
                    },

                    select: {
                        posts: {
                            where: {
                                id: id,
                            },
                        },
                    }
                });

                if (updated) {
                    return{
                        posts: updated.posts,
                    };
                }
            }
        }
        return{
            posts: null,
        };
    
    }

    @Mutation(() => PostResponse)
    async deletepost (
        @Arg("id", () => Int) id: number,
        @Ctx() {req, prisma}: MyContext
    ): Promise<PostResponse | null> {

        const user = getUserId(req);
        if (!user) {
            throw new Error('user not logged in!');
        } else {
            try {

                const deleted = await prisma.user.update({
                    where: {
                        id: user.id,
                    },

                    select: {
                        posts: {
                            where: {
                                id: id,
                            },
                        },
                    },

                    data: {
                        posts: {
                            delete: {
                                id: id,
                            },
                        },
                    },
                });

                
                return{
                    posts: deleted.posts,
                };
            } catch {
                return{
                    posts: null,
                };
            }
        }
    }
}