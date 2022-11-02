import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { set_user, clear_user, selectValue } from '../src/slices/UserSlice';
import '../src/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Footer from '../src/components/Footer';
import Header from '../src/components/Header';
import RegistButton from '../src/components/RegistButton';

const Home: NextPage = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectValue);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!!user) {
        dispatch(set_user(user));
      } else {
        dispatch(clear_user());
        router.replace('/login');
      }
    });
    return () => unsubscribe();
  }, [dispatch, router]);

  if (isLoading) {
    return <></>;
  }

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
      <RegistButton />
      <Footer />
    </>
  );
};

export default Home;
