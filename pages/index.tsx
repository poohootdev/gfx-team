import type { NextPage } from 'next';
import Head from 'next/head';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>GFX TEAM</title>
      </Head>
      <Header />
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Home;
