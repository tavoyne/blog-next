import { Infer, assign, object, string } from "superstruct";

/* -----------------------------------------------------------------------------
 * Structs
 * ---------------------------------------------------------------------------*/

export const PostAttributes = object({
  creationDate: string(),
  description: string(),
  metaDescription: string(),
  title: string(),
});

export const PostMeta = assign(
  PostAttributes,
  object({
    id: string(),
  })
);

export const Post = assign(PostMeta, object({ content: string() }));

/* -----------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------*/

export interface IPostAttributes extends Infer<typeof PostAttributes> {}

export interface IPostMeta extends Infer<typeof PostMeta> {}

export interface IPost extends Infer<typeof Post> {}
