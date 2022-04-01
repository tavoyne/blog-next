import Link from "next/link";

import type { IPostMeta } from "../structs/post";
import Date from "./Date";

export interface PostListProps {
  posts: IPostMeta[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <section>
      <h2>Posts</h2>
      <ul className="post-list">
        {posts.map(({ creationDate, description, id, title }, index) => {
          return (
            <>
              <li key={id}>
                <Link href={`/posts/${id}`}>
                  <a>
                    <Date dateString={creationDate} />
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </a>
                </Link>
              </li>
              {index !== posts.length - 1 && <hr />}
            </>
          );
        })}
      </ul>
    </section>
  );
}
