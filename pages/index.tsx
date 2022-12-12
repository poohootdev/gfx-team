import { useState, useEffect, FormEvent, useCallback, useRef } from 'react';
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
import '../src/firebase';
import { set, ref, getDatabase } from 'firebase/database';
import PopupUIRegist from '../src/components/popup/PopupUIRegist';
import GFxList from '../src/components/gfxlist/GFxList';

const Home: NextPage = () => {
  interface FormElements extends HTMLFormElement {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface FormTarget extends FormEvent<HTMLFormElement> {
    target: FormElements;
  }

  interface GFxListObject {
    getData: () => void;
  }

  const gfxListRef = useRef<GFxListObject>(null);

  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectValue);

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [warningFla, setWarningFla] = useState('');
  const [warningSubject, setWarningSubject] = useState('');
  const [warningMember, setWarningMember] = useState('');
  const [warningAPI, setWarningAPI] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const postUIData = useCallback(
    async (fla: string, subject: string, member: string, api: string) => {
      setError('');
      setLoading(true);

      try {
        await set(ref(getDatabase(), 'ui/' + fla), {
          fla: fla,
          subject: subject,
          member: member,
          api: api,
        });

        setOpen(false);
        setLoading(false);
        gfxListRef.current?.getData();
        // router.replace('/');
        // router.reload();
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        setLoading(false);
      }
    },
    [],
  );

  const handleSubmit = (event: FormTarget) => {
    event.preventDefault();

    const fla = event.target.fla.value;
    const subject = event.target.subject.value;
    const member = event.target.member.value;
    const api = event.target.api.value;

    if (!fla) {
      setWarningFla('필수 정보 입니다.');
    } else {
      setWarningFla('');
    }

    if (!subject) {
      setWarningSubject('필수 정보 입니다.');
    } else {
      setWarningSubject('');
    }

    if (!member) {
      setWarningMember('필수 정보 입니다.');
    } else {
      setWarningMember('');
    }

    if (!api) {
      setWarningAPI('필수 정보 입니다.');
    } else {
      setWarningAPI('');
    }

    if (fla && subject && member && api) {
      postUIData(fla, subject, member, api);
    }
  };

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
            {/* <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" /> */}
            <GFxList ref={gfxListRef} />
          </div>
        </div>
      </main>
      <RegistButton
        onClick={() => {
          setWarningFla('');
          setWarningSubject('');
          setWarningMember('');
          setWarningAPI('');

          setOpen(true);
        }}
      />
      <Footer />

      <PopupUIRegist
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        warningFla={warningFla}
        warningSubject={warningSubject}
        warningMember={warningMember}
        warningAPI={warningAPI}
        error={error}
        loading={loading}
      />
    </>
  );
};

export default Home;
