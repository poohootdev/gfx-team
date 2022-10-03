import type { NextPage } from 'next';
import { useState } from 'react';

import JoinInput from '../components/joinInput';

// interface
interface UserInfo {
  id: string;
  name: string;
  pw: string;
  pw_re: string;
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
    if (
      userInfo.id.length == 0 ||
      userInfo.name.length == 0 ||
      userInfo.pw.length == 0 ||
      userInfo.pw_re.length == 0
    ) {
      alert('모든 항목을 입력해 주세요.');
      return;
    }

    if (null == userInfo.id.match('^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')) {
      alert('E-Mail 형식이 잘못되었습니다.');
      return;
    }

    if (null == userInfo.pw.match('^[A-Za-z0-9]{6,12}$')) {
      alert('비밀번호는 6글자 이상이어야 합니다.');
      return;
    }

    if (userInfo.pw != userInfo.pw_re) {
      alert('비밀번호가 같지 않습니다.');
      return;
    }

    alert('가입 완료!');
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
          <button onClick={joinClick}>Join</button>
        </div>
      </div>
    </section>
  );
};

export default JoinPage;
