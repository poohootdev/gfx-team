import React, { useState, useEffect, FormEvent, forwardRef, useImperativeHandle } from 'react';
import { get, set, child, ref, getDatabase } from 'firebase/database';

import GFxItem from './GFxItem';
import GFxNav from './GFxNav';
import PopupUIUpdate from '../popup/PopupUIUpdate';
import PopupUIDel from '../popup/PopupUIDel';

export interface ListInfo {
  api: string;
  fla: string;
  member: string;
  subject: string;
}

interface FormElements extends HTMLFormElement {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface FormTarget extends FormEvent<HTMLFormElement> {
  target: FormElements;
}

// const GFxList = () => {
const GFxList = forwardRef(function GFxList(props: unknown, gfxRef?: React.Ref<unknown>) {
  const [data, setData] = useState<ListInfo[]>([]);
  const [setMenu, setSelMenu] = useState('');

  const [item, setItem] = useState({ api: '', fla: '', member: '', subject: '' });

  useImperativeHandle(gfxRef, () => ({
    getData: () => getData(),
  }));

  const changeMenu = (name: string) => {
    setSelMenu(name);
  };

  // 업데이트 팝입 띄우기, item에는 수정되어야 하는 리스트 정보가 들어 있음
  const showUpdatePopup = (b: boolean, item?: ListInfo) => {
    if (item) {
      setItem(item);
      setUpdateOpen(b);
    }
  };

  const showDelPopup = (b: boolean, item?: ListInfo) => {
    if (item) {
      setItem(item);
      setDelOpen(b);
    }
  };

  // 업데이트 팝업 or 삭제 팝업 서밋 클릭시
  const handleSubmit = (event: FormTarget) => {
    event.preventDefault();

    if (event.target.id === 'form_update') {
      const fla = event.target.fla.value;
      const subject = event.target.subject.value;
      const member = event.target.member.value;
      const api = event.target.api.value;

      if (fla != '' && subject != '' && member != '' && api != '') {
        const pItem: ListInfo = { fla: fla, subject: subject, member: member, api: api };
        setUpdate(pItem);
      }
    } else if (event.target.id === 'form_del') {
      setDelete();
    }
  };

  const setUpdate = (pItem: ListInfo) => {
    const db = getDatabase();
    setUpdateIsLoading(true);

    set(ref(db, 'ui/' + item.fla), {
      api: pItem.api,
      fla: pItem.fla,
      member: pItem.member,
      subject: pItem.subject,
    })
      .then(() => {
        setUpdateIsLoading(false);
        setUpdateOpen(false);
        getData(); // 다시 읽어 오기
      })
      .catch((error: Error) => {
        setUpdateIsLoading(false);
        setUpdateOpen(false);
        setUpdateError(error.message);
      });
  };

  const setDelete = () => {
    const db = getDatabase();
    setDelIsLoading(true);

    set(ref(db, 'ui/' + item.fla), {})
      .then(() => {
        setDelIsLoading(false);
        setDelOpen(false);
        getData(); // 다시 읽어 오기
      })
      .catch((error: Error) => {
        setDelIsLoading(false);
        setDelOpen(false);
        setDelError(error.message);
      });
  };

  // firebase GFx 리스트 가져오기
  const getData = async () => {
    //
    const snapShot = await get(child(ref(getDatabase()), 'ui')); // 'ui' : 데이터 가져올 위치
    const ary: ListInfo[] = snapShot.val() ? Object.values(snapShot.val()) : [];
    setData(ary);
  };

  // PopupUIUpdate
  const [updateOpen, setUpdateOpen] = useState(false);
  const [updateIsLoading, setUpdateIsLoading] = useState(false);
  const [updateEerror, setUpdateError] = useState('');

  // PopupUIDel
  const [delOpen, setDelOpen] = useState(false);
  const [delIsLoading, setDelIsLoading] = useState(false);
  const [delEerror, setDelError] = useState('');

  useEffect(() => {
    getData();
    return () => {
      setData([]);
    };
  }, []);

  return (
    <>
      <div>
        <GFxNav changeMenu={changeMenu} />
        <GFxItem
          showUpdatePopup={showUpdatePopup}
          showDelPopup={showDelPopup}
          list={data}
          selMenu={setMenu}
        />
        <PopupUIUpdate
          open={updateOpen}
          setOpen={setUpdateOpen}
          handleSubmit={handleSubmit}
          error={updateEerror}
          loading={updateIsLoading}
          item={item}
        />
        <PopupUIDel
          open={delOpen}
          setOpen={setDelOpen}
          handleSubmit={handleSubmit}
          error={delEerror}
          loading={delIsLoading}
          item={item}
        />
      </div>
    </>
  );
});

export default GFxList;
