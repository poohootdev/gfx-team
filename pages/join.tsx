import React, { useState, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import '../src/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { set, ref, getDatabase } from 'firebase/database';
import { set_user } from '../src/slices/UserSlice';
import JoinInput from '../src/components/JoinInput';

const JoinPage: NextPage = () => {
  interface UserInfo {
    id: string;
    name: string;
    pw: string;
    pw_re: string;
  }

  interface Error {
    message: string;
  }

  // state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: '',
    pw: '',
    pw_re: '',
  });

  // enum
  const JOIN_INFO = {
    ID: 'id',
    NAME: 'name',
    PW: 'pw',
    PW_RE: 'pw_re',
  } as const;
  type JOIN_INFO = typeof JOIN_INFO[keyof typeof JOIN_INFO];

  const router = useRouter();
  const dispatch = useDispatch();
  const [error, setError] = useState('');

  const postUserData = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        const { user } = await createUserWithEmailAndPassword(getAuth(), email, password);
        await updateProfile(user, {
          displayName: name,
          photoURL: '',
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

  // 가입 클릭시...
  const joinClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      const email = userInfo.id;
      const name = userInfo.name;
      const password = userInfo.pw;
      const passwordConfirm = userInfo.pw_re;

      if (
        email.length == 0 ||
        name.length == 0 ||
        password.length == 0 ||
        passwordConfirm.length == 0
      ) {
        setError('모든 항목을 입력해 주세요.');
        return;
      }

      if (null == email.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
        setError('E-Mail 형식이 잘못되었습니다.');
        return;
      }

      if (null == password.match('^[A-Za-z0-9]{6,12}$')) {
        setError('비밀번호는 6글자 이상이어야 합니다.');
        return;
      }

      if (password != passwordConfirm) {
        setError('비밀번호가 같지 않습니다.');
        return;
      }

      postUserData(email, password, name);
    },
    [postUserData, userInfo],
  );

  // 인풋 텍스트에서 가입에 필요한 정보를 받드면 userInfo를 갱신한다.
  const changeInfo = (joinInfo: JOIN_INFO, value: string) => {
    const info = { ...userInfo };

    switch (joinInfo) {
      case JOIN_INFO.ID:
        info.id = value;
        setUserInfo(info);
        break;

      case JOIN_INFO.NAME:
        info.name = value;
        setUserInfo(info);
        break;

      case JOIN_INFO.PW:
        info.pw = value;
        setUserInfo(info);
        break;

      case JOIN_INFO.PW_RE:
        info.pw_re = value;
        setUserInfo(info);
        break;

      default:
        break;
    }
  };

  const onChangeX = (joinInfo: JOIN_INFO, value: string) => {
    //console.log(`joinInfo = ${joinInfo} value = ${value}`);
    changeInfo(joinInfo, value);
  };

  return (
    <section className="h-full h-screen bg-zinc-200">
      <div className="flex justify-center items-center h-full">
        <div className="text-center bg-[#504C98] rounded-lg border-red-600 p-4">
          <JoinInput
            type={'text'}
            label={'아이디(이메일)'}
            placeholder={''}
            joinType={JOIN_INFO.ID}
            onChangeX={onChangeX}
          ></JoinInput>
          <JoinInput
            type={'text'}
            label={'이름'}
            placeholder={''}
            joinType={JOIN_INFO.NAME}
            onChangeX={onChangeX}
          ></JoinInput>
          <JoinInput
            type={'password'}
            label={'비밀번호'}
            placeholder={''}
            joinType={JOIN_INFO.PW}
            onChangeX={onChangeX}
          ></JoinInput>
          <JoinInput
            type={'password'}
            label={'비밀번호 확인'}
            placeholder={'비밀번호를 다시 입력해 주세요.'}
            joinType={JOIN_INFO.PW_RE}
            onChangeX={onChangeX}
          ></JoinInput>
          {error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          ) : null}

          <button className="mt-4" onClick={joinClick}>
            회원 가입
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinPage;
