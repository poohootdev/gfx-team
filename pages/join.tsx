import type { NextPage } from 'next';
import { useState, useRef } from 'react';
import JoinInput from '../src/components/JoinInput';

// interface
interface UserInfo {
  id: string;
  name: string;
  pw: string;
  pw_re: string;
}

interface JoinInputHandle {
  handleWarningMsg: (msg: string) => void;
}

// enum
const JOIN_INFO = {
  ID: 'id',
  NAME: 'name',
  PW: 'pw',
  PW_RE: 'pw_re',
} as const;
type JOIN_INFO = typeof JOIN_INFO[keyof typeof JOIN_INFO];

const JoinPage: NextPage = () => {
  // state
  const [userInfo, setUserInfo] = useState<UserInfo>({
    id: '',
    name: '',
    pw: '',
    pw_re: '',
  });

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

  // 가입 클릭시...
  const joinClick = () => {
    if (ref_id.current && ref_name.current && ref_pw.current && ref_pwRe.current) {
      const id = ref_id.current;
      const name = ref_name.current;
      const pw = ref_pw.current;
      const pwRe = ref_pwRe.current;

      // id 체크
      if (userInfo.id.length == 0) {
        id.handleWarningMsg('필수 정보입니다.');
      } else if (null == userInfo.id.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
        id.handleWarningMsg('E-Mail 형식이 잘못되었습니다.');
      } else {
        id.handleWarningMsg('');
      }

      // 이름 체크
      if (userInfo.name.length == 0) {
        name.handleWarningMsg('필수 정보입니다.');
      } else {
        name.handleWarningMsg('');
      }

      // 비밀번호 체크
      if (userInfo.pw.length == 0) {
        pw.handleWarningMsg('필수 정보입니다.');
      } else if (null == userInfo.pw.match('^[A-Za-z0-9]{6,16}$')) {
        pw.handleWarningMsg('6~16자 영문 대 소문자, 숫자를 사용하세요.');
      } else {
        pw.handleWarningMsg('');
      }

      // 비밀번호 확인
      if (userInfo.pw_re.length == 0) {
        pwRe.handleWarningMsg('필수 정보입니다.');
      } else if (userInfo.pw != userInfo.pw_re) {
        pwRe.handleWarningMsg('비밀번호가 같지 않습니다.');
      } else {
        pwRe.handleWarningMsg('');
      }
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
          <button onClick={joinClick}>회원 가입</button>
        </div>
      </div>
    </section>
  );
};

export default JoinPage;
