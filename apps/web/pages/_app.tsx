// import "../styles/globals.css";
// import type { AppType, AppProps } from "next/app";

// const App: AppType = ({ Component, pageProps }: AppProps) => {
//   return <Component {...pageProps} />;
// };

// export default App;

import Head from "next/head";
import type { AppType, AppProps } from "next/app";
import { slugifyWithCounter } from "@sindresorhus/slugify";

import { Layout } from "../components/docs/Layout";

import "focus-visible";
import "../styles/globals.css";

function getNodeText(node: any) {
  let text = "";
  for (let child of node.children ?? []) {
    if (typeof child === "string") {
      text += child;
    }
    text += getNodeText(child);
  }
  return text;
}

function collectHeadings(nodes: any, slugify = slugifyWithCounter()): any {
  let sections = [];

  for (let node of nodes) {
    if (node.name === "h2" || node.name === "h3") {
      let title = getNodeText(node);
      if (title) {
        let id = slugify(title);
        node.attributes.id = id;
        if (node.name === "h3") {
          if (!sections[sections.length - 1]) {
            throw new Error(
              "Cannot add `h3` to table of contents without a preceding `h2`"
            );
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          });
        } else {
          sections.push({ ...node.attributes, title, children: [] });
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify));
  }

  return sections;
}

const App: AppType = ({ Component, pageProps }: AppProps) => {
  let title = pageProps.markdoc?.frontmatter.title;

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} - Docs`;

  let description = pageProps.markdoc?.frontmatter.description;

  // let tableOfContents = pageProps.markdoc?.content
  //   ? collectHeadings(pageProps.markdoc.content)
  //   : [];

  if (!pageProps.markdoc) return <Component {...pageProps} />;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      <Layout title={title}>
        <Component {...pageProps} />
      </Layout>
      {/* <Layout frontmatter={pageProps.markdoc.frontmatter}>
        <Component {...pageProps} />
      </Layout> */}
    </>
  );
};

export default App;
