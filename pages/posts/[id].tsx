import Head from "next/head";

import Date from "../../components/Date";
import Layout from "../../components/Layout";
import { getPost, getPostIds } from "../../lib/posts";
import type { Post } from "../../lib/posts";
import utilStyles from "../../styles/utils.module.css";

export async function getStaticProps({ params }: any) {
  const post = (await getPost(params.id))!;
  return { props: { post } };
}

export async function getStaticPaths() {
  const paths = await getPostIds();
  return {
    fallback: false,
    paths: paths.map((path) => {
      return { params: { id: path } };
    }),
  };
}

export default function Post({
  post,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <Layout home={false}>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{post.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={post.creationDate} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </Layout>
  );
}
