import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PrismaClient } from '@prisma/client';
import { MyContext } from "./types";
import { PostResolver } from "./resolvers/postResolver";

const main = async () => {
    const prisma = new PrismaClient();

    const app = express();

    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),

        context: ({req, res}): MyContext => ({ prisma, req, res}),
    });

    apolloServer.applyMiddleware({app});

    app.listen(4000, () => {
        console.log('server started on local host : 4000')
    })
}

main().catch((err) => {
    console.error(err);
});

console.log("hello prudhvi")
