import type { GetStaticPropsResult, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";

import PostList from "../components/PostList";
import { getPosts } from "../lib/post";
import ProfileJPG from "../public/images/profile.jpg";
import type { IPostMeta } from "../structs/post";

export async function getStaticProps(): Promise<
  GetStaticPropsResult<{ posts: IPostMeta[] }>
> {
  const posts = await getPosts();
  return { props: { posts } };
}

export default function Home({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title key="title">Théophile Avoyne • Software engineer</title>
      </Head>
      <Image
        priority
        src={ProfileJPG}
        height={128}
        width={128}
        alt="Théophile Avoyne"
      />
      <h1>About</h1>
      <section>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In
          condimentum lobortis magna. Vivamus fermentum fermentum turpis nec
          posuere. Duis felis purus, lacinia ac tristique eget.
        </p>
        <p>
          Pulvinar ut nisl. Nunc id molestie magna. Integer vel nunc vulputate,
          ultricies magna nec, sollicitudin justo. Cras semper at neque id
          mollis. Ut sagittis euismod quam vel porttitor. Cras vel enim purus.
          Aenean tellus ligula.
        </p>
        <p>
          Lacinia quis volutpat eget, elementum porttitor tellus. Nam quis odio
          ligula. Duis consectetur lacus eu nunc porta porttitor. Nullam est
          lorem, imperdiet eu erat ut, dignissim hendrerit magna. Aliquam erat
          volutpat.
        </p>
      </section>
      <PostList posts={posts} />
    </>
  );
}
