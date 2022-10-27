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

  const postUserData = useCallback(
    async (email: string, password: string, name: string) => {
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
      setWarningEmail('필수 정보 입니다.');
    } else if (null == email.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
      setWarningEmail('이메일 형식이 잘못되었습니다.');
    } else {
      setWarningEmail('');
    }

    if (!userName) {
      setWarningUserName('필수 정보 입니다.');
    } else {
      setWarningUserName('');
    }

    if (!password) {
      setWarningPassword('필수 정보 입니다.');
    } else if (null == password.match('^[A-Za-z0-9]{6,16}$')) {
      setWarningPassword('6~16자 영문 대 소문자, 숫자를 사용하세요.');
    } else {
      setWarningPassword('');
    }

    if (!passwordConfirm) {
      setWarningPasswordConfirm('필수 정보 입니다.');
    } else if (password != passwordConfirm) {
      setWarningPasswordConfirm('비밀번호가 같지 않습니다.');
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
        <title>GFX TEAM - 회원 가입</title>
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
            <div className="flex justify-center text-2xl mt-2">회원 가입</div>
            <UserInfoInput
              id={'email'}
              className={'mt-4 mb-4'}
              placeholder={'아이디(이메일) 입력'}
              warnigMsg={warningEmail}
            ></UserInfoInput>
            <UserInfoInput
              id={'userName'}
              placeholder={'이름 입력'}
              warnigMsg={warningUserName}
              autoComplete={'off'}
            ></UserInfoInput>
            <UserInfoInput
              id={'password'}
              type={'password'}
              placeholder={'비밀번호 입력'}
              autoComplete={'off'}
              warnigMsg={warningPassword}
            ></UserInfoInput>
            <UserInfoInput
              id={'passwordConfirm'}
              type={'password'}
              placeholder={'비밀번호 확인 입력'}
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

            <div className="flex items-center justify-center">
              <input
                id="submit"
                type="submit"
                className="w-full rounded-md border border-transparent bg-gray-900 py-2 px-4 text-white hover:bg-gray-700"
                value="로그인"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default JoinPage;
