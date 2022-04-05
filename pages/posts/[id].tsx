import type {
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/dark.css";

import Date from "../../components/Date";
import { getPost, getPostIds } from "../../lib/post";
import type { IPost } from "../../structs/post";

export async function getStaticPaths(): Promise<
  GetStaticPathsResult<{ id: string }>
> {
  const paths = (await getPostIds()).map((path) => {
    return { params: { id: path } };
  });
  return {
    fallback: false,
    paths,
  };
}

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ id: string }>): Promise<
  GetStaticPropsResult<{ post: IPost }>
> {
  const post = await getPost(params!.id);
  return post ? { props: { post } } : { notFound: true };
}

export default function Post({
  post,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <meta
          content={post.metaDescription}
          key="description"
          name="description"
        />
        <title key="title">{post.title}</title>
      </Head>
      <article>
        <h1>{post.title}</h1>
        <p>
          <Date dateString={post.creationDate} />
        </p>
        <ReactMarkdown
          rehypePlugins={[rehypeHighlight]}
          remarkPlugins={[remarkGfm]}
        >
          {post.content}
        </ReactMarkdown>
      </article>
      <hr />
      <a
        href={`https://github.com/tavoyne/blog-next/blob/master/posts/${post.id}.md`}
      >
        Edit on GitHub
      </a>
    </>
  );
}
