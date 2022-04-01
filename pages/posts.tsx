import type { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import Head from "next/head";

import PostList from "../components/PostList";
import { getPosts } from "../lib/post";
import type { IPostMeta } from "../structs/post";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ posts: IPostMeta[] }>
> {
  const posts = await getPosts();
  return { props: { posts } };
}

export default function Posts({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <meta
          content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Incondimentum lobortis magna. Vivamus fermentum fermentum turpis nec posuere."
          key="description"
          name="description"
        />
        <title key="title">Posts • Théophile Avoyne</title>
      </Head>
      <PostList posts={posts} />
    </>
  );
}
