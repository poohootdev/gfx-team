import React, { useState, useCallback, FormEvent } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import UserInfoInput from '../src/components/UserInfoInput';
import '../src/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage: NextPage = () => {
  const router = useRouter();

  interface FormElements extends HTMLFormElement {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface FormTarget extends FormEvent<HTMLFormElement> {
    target: FormElements;
  }

  interface Error {
    message: string;
  }

  const [warningEmail, setWarningEmail] = useState('');
  const [warningPassword, setWarningPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormTarget) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    if (!email) {
      setWarningEmail('필수 정보 입니다.');
    } else if (null == email.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
      setWarningEmail('이메일 형식이 잘못되었습니다.');
    } else {
      setWarningEmail('');
    }

    if (!password) {
      setWarningPassword('필수 정보 입니다.');
    } else if (null == password.match('^[A-Za-z0-9]{6,16}$')) {
      setWarningPassword('6~16자 영문 대 소문자, 숫자를 사용하세요.');
    } else {
      setWarningPassword('');
    }

    if (email && password) {
      loginUser(email, password);
    }
  };

  const loginUser = useCallback(
    async (email: string, password: string) => {
      setError('');
      setLoading(true);

      try {
        await signInWithEmailAndPassword(getAuth(), email, password).then(() => {
          router.push('/');
        });
      } catch (e) {
        const error = e as Error;
        setError(error.message);
        setLoading(false);
      }
    },
    [router],
  );

  return (
    <>
      <Head>
        <title>GFX TEAM - 로그인</title>
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
            <div className="flex justify-center text-2xl mt-2">GFX TEAM 로그인</div>
            <UserInfoInput
              id={'email'}
              className={'mt-4 mb-4'}
              placeholder={'아이디(이메일) 입력'}
              warnigMsg={warningEmail}
            ></UserInfoInput>
            <UserInfoInput
              id={'password'}
              type={'password'}
              placeholder={'비밀번호 입력'}
              autoComplete={'off'}
              warnigMsg={warningPassword}
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
                  value="로그인"
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
                  처리중...
                </button>
              </div>
            ) : null}

            <div className="flex justify-end">
              <Link href="../join">
                <button className="text-blue-900">
                  <b>회원가입</b>
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
