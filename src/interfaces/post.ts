import { Field, ObjectType, ID, Int } from 'type-graphql';

@ObjectType()
export class Post {
    @Field(() => ID)
    id: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    @Field()
    content: string;

    @Field(()=> Int, {nullable: true})
    authorId: number | null;
}