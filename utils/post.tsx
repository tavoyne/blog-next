import fm from "front-matter";
import { marked } from "marked";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "superstruct";

import { PostAttributes } from "../structs/post";
import type { IPost, IPostMeta } from "../structs/post";

const __dirname = dirname(fileURLToPath(import.meta.url));

const postsPath = join(__dirname, "..", "posts");

/* -------------------------------------------------------------------------------------------------
 * getPost
 * -----------------------------------------------------------------------------------------------*/

export async function getPost(id: IPost["id"]): Promise<IPost | null> {
  const postPath = join(postsPath, `${id}.md`);
  let content: Awaited<ReturnType<typeof readFile>>;
  try {
    content = await readFile(postPath);
  } catch (err) {
    if (err === "ENOENT") {
      return null;
    }
    throw err;
  }
  const { attributes, body } = fm(content.toString());
  assert(attributes, PostAttributes);
  const html = marked(body);
  return {
    html,
    id,
    ...attributes,
  };
}

/* -------------------------------------------------------------------------------------------------
 * getPostIds
 * -----------------------------------------------------------------------------------------------*/

export async function getPostIds(): Promise<IPost["id"][]> {
  return (await readdir(postsPath))
    .filter((fileName) => {
      return fileName.endsWith(".md");
    })
    .map((fileName) => {
      return fileName.replace(/\.md$/u, "");
    });
}

/* -------------------------------------------------------------------------------------------------
 * getPosts
 * -----------------------------------------------------------------------------------------------*/

export async function getPosts(): Promise<IPostMeta[]> {
  const fileNames = (await readdir(postsPath)).filter((fileName) => {
    return fileName.endsWith(".md");
  });
  return (
    await Promise.all(
      fileNames.map(async (fileName) => {
        return readFile(join(postsPath, fileName));
      })
    )
  ).map((content, index) => {
    const { attributes } = fm(content.toString());
    assert(attributes, PostAttributes);
    return {
      id: fileNames[index].replace(/\.md$/u, ""),
      ...attributes,
    };
  });
}
