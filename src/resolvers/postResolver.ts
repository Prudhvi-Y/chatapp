import { MyContext } from "../types";
import { Arg, Ctx, Int, Mutation, PubSub, PubSubEngine, Query, Resolver, Root, Subscription } from "type-graphql";
import { PostResponse } from "../reponses/posts";
import { getUserId } from "../helpers/jwtUtil";
import { User } from "../interfaces/user";

const POST_CREATED = 'POSTCREATED';

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
        @PubSub() pubsub: PubSubEngine,
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
                const payload: User = user;
                await pubsub.publish(POST_CREATED, payload);
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

    @Subscription(()=>PostResponse, {
        topics: POST_CREATED,
    })
    async postCreated(
        @Root() notificationPayload: User,
        @Arg("email") email: string,
        @Ctx() {prisma}: MyContext,
    ): Promise<PostResponse> {
        
        if (notificationPayload.email === email){
            console.log(email)
            const userposts = await prisma.user.findFirst({
                where: {
                    email: email,
                },
                include: {
                    posts: true,
                },
            });

            return {
                posts: userposts?.posts,
            };
        }
        return {
            posts: null,
        }
    
    }
};