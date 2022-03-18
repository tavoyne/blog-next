/* eslint-disable node/no-sync */
import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((filename) => {
      return filename.endsWith(".md");
    })
    .map((fileName) => {
      return {
        params: {
          id: fileName.replace(/\.md$/u, ""),
        },
      };
    });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  return {
    contentHtml,
    id,
    ...matterResult.data,
  };
}

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory).filter((filename) => {
    return filename.endsWith(".md");
  });
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/u, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return { id, ...matterResult.data };
  });
  return allPostsData.sort(({ date: a }: any, { date: b }: any) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    }
    return 0;
  });
}
