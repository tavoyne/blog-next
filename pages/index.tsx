import type { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import Date from "../components/Date";
import Layout, { siteTitle } from "../components/Layout";
import { getPosts } from "../lib/posts";
import utilStyles from "../styles/utils.module.css";

export async function getStaticProps() {
  const posts = await getPosts();
  return { props: { posts } };
}

export default function Home({
  posts,
}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
          condimentum lobortis magna. Vivamus fermentum fermentum turpis nec
          posuere. Duis felis purus, lacinia ac tristique eget, pulvinar ut
          nisl. Nunc id molestie magna. Integer vel nunc vulputate, ultricies
          magna nec, sollicitudin justo. Cras semper at neque id mollis. Ut
          sagittis euismod quam vel porttitor. Cras vel enim purus. Aenean
          tellus ligula, lacinia quis volutpat eget, elementum porttitor tellus.
          Nam quis odio ligula. Duis consectetur lacus eu nunc porta porttitor.
          Nullam est lorem, imperdiet eu erat ut, dignissim hendrerit magna.
          Aliquam erat volutpat.
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {posts.map(({ creationDate, id, title }) => {
            return (
              <li className={utilStyles.listItem} key={id}>
                <Link href={`/posts/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={creationDate} />
                </small>
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
