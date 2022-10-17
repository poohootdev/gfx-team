import React, { useState, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import JoinInput from '../src/components/JoinInput';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import '../src/firebase';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { set, ref, getDatabase } from 'firebase/database';
import { set_user } from '../src/slices/UserSlice';
import { Md5 } from 'ts-md5';

const JoinPage: NextPage = () => {
  interface JoinInputHandle {
    handleWarningMsg: (msg: string) => void;
  }

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

  // 가입 클릭시...
  const joinClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      if (ref_id.current && ref_name.current && ref_pw.current && ref_pwRe.current) {
        const refId = ref_id.current;
        const refName = ref_name.current;
        const refPw = ref_pw.current;
        const refPWRe = ref_pwRe.current;

        const email = userInfo.id;
        const name = userInfo.name;
        const password = userInfo.pw;
        const passwordConfirm = userInfo.pw_re;

        let bId: boolean;
        let bName: boolean;
        let bPassword: boolean;

        // id 체크
        bId = false;
        if (email.length == 0) {
          refId.handleWarningMsg('필수 정보입니다.');
        } else if (null == email.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
          refId.handleWarningMsg('E-Mail 형식이 잘못되었습니다.');
        } else {
          refId.handleWarningMsg('');
          bId = true;
        }

        // 이름 체크
        bName = false;
        if (name.length == 0) {
          refName.handleWarningMsg('필수 정보입니다.');
        } else {
          refName.handleWarningMsg('');
          bName = true;
        }

        // 비밀번호 체크
        bPassword = false;
        if (password.length == 0) {
          refPw.handleWarningMsg('필수 정보입니다.');
        } else if (null == password.match('^[A-Za-z0-9]{6,16}$')) {
          refPw.handleWarningMsg('6~16자 영문 대 소문자, 숫자를 사용하세요.');
        } else {
          refPw.handleWarningMsg('');
          bPassword = true;
        }

        // 비밀번호 확인
        bPassword = false;
        if (passwordConfirm.length == 0) {
          refPWRe.handleWarningMsg('필수 정보입니다.');
        } else if (password != passwordConfirm) {
          refPWRe.handleWarningMsg('비밀번호가 같지 않습니다.');
        } else {
          refPWRe.handleWarningMsg('');
          bPassword = true;
        }

        if (bId && bName && bPassword) postUserData(email, password, name);
      }
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
    changeInfo(joinInfo, value);
  };

  const ref_id = useRef<JoinInputHandle>(null);
  const ref_name = useRef<JoinInputHandle>(null);
  const ref_pw = useRef<JoinInputHandle>(null);
  const ref_pwRe = useRef<JoinInputHandle>(null);

  return (
    <section className="h-full h-screen bg-white shadow">
      <div className="flex justify-center items-center h-full">
        <div className="text-center bg-gray-900 text-[#ebe8e2] rounded-lg border-red-600 p-4">
          <JoinInput
            type={'text'}
            label={'아이디(이메일)'}
            placeholder={''}
            joinType={JOIN_INFO.ID}
            onChangeX={onChangeX}
            ref={ref_id}
          ></JoinInput>
          <JoinInput
            type={'text'}
            label={'이름'}
            placeholder={''}
            joinType={JOIN_INFO.NAME}
            onChangeX={onChangeX}
            ref={ref_name}
          ></JoinInput>
          <JoinInput
            type={'password'}
            label={'비밀번호'}
            placeholder={''}
            joinType={JOIN_INFO.PW}
            onChangeX={onChangeX}
            ref={ref_pw}
          ></JoinInput>
          <JoinInput
            type={'password'}
            label={'비밀번호 확인'}
            placeholder={'비밀번호를 다시 입력해 주세요.'}
            joinType={JOIN_INFO.PW_RE}
            onChangeX={onChangeX}
            ref={ref_pwRe}
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
