import "reflect-metadata";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PrismaClient } from '@prisma/client';

const main = async () => {
    const prisma = new PrismaClient();

    await prisma.post.create({
        data: {
            title: 'hello',
            author: 'prudhvi',
        },
    });
    const alltitles = await prisma.post.findMany();
    console.log(alltitles);
    const app = express();

    const apolloServer = new ApolloServer ({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false
        }),
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