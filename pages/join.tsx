import React, { useState, useCallback, FormEvent } from 'react';
import type { NextPage } from 'next';
import UserInfoInput from '../src/components/UserInfoInput';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import '../src/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { set, ref, getDatabase } from 'firebase/database';
import { set_user } from '../src/slices/UserSlice';
import { Md5 } from 'ts-md5';

const JoinPage: NextPage = () => {
  interface Error {
    message: string;
  }

  interface FormElements extends HTMLFormElement {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface FormTarget extends FormEvent<HTMLFormElement> {
    target: FormElements;
  }

  const router = useRouter();
  const dispatch = useDispatch();

  const [warningEmail, setWarningEmail] = useState('');
  const [warningUserName, setWarningUserName] = useState('');
  const [warningPassword, setWarningPassword] = useState('');
  const [warningPasswordConfirm, setWarningPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const postUserData = useCallback(
    async (email: string, password: string, name: string) => {
      setError('');
      setLoading(true);

      try {
        const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
        await updateProfile(user, {
          displayName: name,
          photoURL: `https://www.gravatar.com/avatar/${Md5.hashStr(email)}?d=identicon`,
        });

        await set(ref(getDatabase(), 'users/' + user.uid), {
          name: user.displayName,
          avatar: user.photoURL,
        });

        await dispatch(set_user(user));

        await router.push('/');
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        setLoading(false);
      }
    },
    [dispatch, router],
  );

  const handleSubmit = (event: FormTarget) => {
    event.preventDefault();

    const email = event.target.email.value;
    const userName = event.target.userName.value;
    const password = event.target.password.value;
    const passwordConfirm = event.target.passwordConfirm.value;

    if (!email) {
      setWarningEmail('?????? ?????? ?????????.');
    } else if (null == email.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
      setWarningEmail('????????? ????????? ?????????????????????.');
    } else {
      setWarningEmail('');
    }

    if (!userName) {
      setWarningUserName('?????? ?????? ?????????.');
    } else {
      setWarningUserName('');
    }

    if (!password) {
      setWarningPassword('?????? ?????? ?????????.');
    } else if (null == password.match('^[A-Za-z0-9]{6,16}$')) {
      setWarningPassword('6~16??? ?????? ??? ?????????, ????????? ???????????????.');
    } else {
      setWarningPassword('');
    }

    if (!passwordConfirm) {
      setWarningPasswordConfirm('?????? ?????? ?????????.');
    } else if (password != passwordConfirm) {
      setWarningPasswordConfirm('??????????????? ?????? ????????????.');
    } else {
      setWarningPasswordConfirm('');
    }

    if (email && userName && password && passwordConfirm && password === passwordConfirm) {
      postUserData(email, password, userName);
    }
  };

  return (
    <>
      <Head>
        <title>GFX TEAM - ?????? ??????</title>
      </Head>
      <div className="flex h-screen">
        <div className="m-auto">
          <form
            action="#"
            method="POST"
            onSubmit={handleSubmit}
            id="form"
            className="w-96 max-w-md m-auto rounded px-8 pt-6 pb-8 mb-4"
            autoComplete="off"
          >
            <div className="flex justify-center text-2xl mt-2">?????? ??????</div>
            <UserInfoInput
              id={'email'}
              className={'mt-4 mb-4'}
              placeholder={'?????????(?????????) ??????'}
              warnigMsg={warningEmail}
            ></UserInfoInput>
            <UserInfoInput
              id={'userName'}
              placeholder={'?????? ??????'}
              warnigMsg={warningUserName}
              autoComplete={'off'}
            ></UserInfoInput>
            <UserInfoInput
              id={'password'}
              type={'password'}
              placeholder={'???????????? ??????'}
              autoComplete={'off'}
              warnigMsg={warningPassword}
            ></UserInfoInput>
            <UserInfoInput
              id={'passwordConfirm'}
              type={'password'}
              placeholder={'???????????? ?????? ??????'}
              autoComplete={'off'}
              warnigMsg={warningPasswordConfirm}
            ></UserInfoInput>
            {error ? (
              <div
                className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            ) : null}
            {!loading ? (
              <div className="flex items-center justify-center">
                <input
                  id="submit"
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-gray-900 py-2 px-4 text-white hover:bg-gray-700"
                  value="????????????"
                />
              </div>
            ) : null}

            {loading ? (
              <div className="flex items-center">
                <button
                  type="button"
                  className="inline-flex w-full justify-center px-4 py-2 leading-6 rounded-md border border-transparent text-white bg-gray-900 cursor-not-allowed"
                >
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  ?????????...
                </button>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinPage;
