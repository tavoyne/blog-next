import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";

import EnvelopeIcon from "../components/EnvelopeIcon";
import TwitterIcon from "../components/TwitterIcon";
import "../styles/index.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav className="stack">
          <Link href="/">
            <a>About</a>
          </Link>
          <Link href="/posts">
            <a>Posts</a>
          </Link>
        </nav>
        <div className="stack">
          <a aria-label="Twitter" href="https://twitter.com/tavoyne">
            <TwitterIcon />
          </a>
          <a aria-label="Email" href="mailto:me@tavoyne.com">
            <EnvelopeIcon />
          </a>
        </div>
      </header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
