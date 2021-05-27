import { Field, ObjectType, ID } from 'type-graphql';

@ObjectType()
export class Post {
    @Field(() => ID)
    id: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    author: string;

    @Field()
    title: string;
}