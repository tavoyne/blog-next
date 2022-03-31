import Link from "next/link";

import type { IPostMeta } from "../structs/post";
import Date from "./Date";

export interface PostListProps {
  posts: IPostMeta[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <section>
      <h1>Posts</h1>
      <ul>
        {posts.map(({ creationDate, id, title }) => {
          return (
            <li key={id}>
              <Link href={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small>
                <Date dateString={creationDate} />
              </small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
