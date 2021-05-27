import { Post } from '../interfaces/post';
import 'reflect-metadata';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PostResponse {
    @Field(() => [Post], {nullable: true})
    posts?: Post[] | null
}