import { Post } from '.prisma/client';
import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PostResponse {
    @Field(() => Post, {nullable: true})
    posts?: Post | null
}