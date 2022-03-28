import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";

import Date from "../../components/Date";
import type { IPost } from "../../structs/post";
import { getPost, getPostIds } from "../../utils/post";

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<{ id: string }>
> {
  const paths = await getPostIds();
  return {
    fallback: false,
    paths: paths.map((path) => {
      return {
        params: {
          id: path,
        },
      };
    }),
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ id: string }>): Promise<
  GetStaticPropsResult<{ post: IPost }>
> {
  const post = await getPost(params!.id);
  return post
    ? {
        props: { post },
      }
    : { notFound: true };
}

export default function Post({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title key="title">{post.title}</title>
      </Head>
      <article>
        <h1>{post.title}</h1>
        <div>
          <Date dateString={post.creationDate} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </>
  );
}
