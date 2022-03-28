import type { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import Head from "next/head";

import PostList from "../components/PostList";
import { getPosts } from "../lib/posts";
import type { IPostMeta } from "../types/post";

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
        <title key="title">Posts • Théophile Avoyne</title>
      </Head>
      <PostList posts={posts} />
    </>
  );
}
