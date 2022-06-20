import { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import globalStyles from '../styles/global';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <title>Default title</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className="layout-container">
        <header>
          <nav>
            <Link href="/">
              <a>Home</a>
            </Link>{' '}
            |{' '}
            <Link href="/ppt-creator">
              <a>ppt Creator</a>
            </Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>
          <span>Footer</span>
        </footer>
      </div>
      <style jsx global>
        {globalStyles}
      </style>
    </div>
  );
}
