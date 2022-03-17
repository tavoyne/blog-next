import Head from "next/head";

import Layout, { siteTitle } from "../components/Layout";
import { getSortedPostsData } from "../lib/posts";
import utilStyles from "../styles/utils.module.css";

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }: any) {
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
          {allPostsData.map(({ id, date, title }: any) => {
            return (
              <li className={utilStyles.listItem} key={id}>
                {title}
                <br />
                {id}
                <br />
                {date}
              </li>
            );
          })}
        </ul>
      </section>
    </Layout>
  );
}
