import { Fragment, useRef, useState, useEffect, FormEvent } from 'react';
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
import { Dialog, Transition } from '@headlessui/react';
import UserInfoInput from '../src/components/UserInfoInput';

const Home: NextPage = () => {
  interface FormElements extends HTMLFormElement {
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface FormTarget extends FormEvent<HTMLFormElement> {
    target: FormElements;
  }

  const dispatch = useDispatch();
  const { isLoading } = useSelector(selectValue);

  const router = useRouter();

  const [open, setOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  const handleSubmit = (event: FormTarget) => {
    event.preventDefault();
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
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200" />
          </div>
        </div>
      </main>
      <RegistButton
        onClick={() => {
          setOpen(true);
        }}
      />
      <Footer />

      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <form
                    action="#"
                    method="POST"
                    onSubmit={handleSubmit}
                    id="form"
                    autoComplete="off"
                  >
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
                        UI 등록하기
                      </h1>
                      <p>Fla 경로</p>
                      <UserInfoInput
                        id={'passwordConfirm'}
                        placeholder={'GFx_P_CustomDifficultyWidzet/PopupCustomDifficultyWidzet.fla'}
                        autoComplete={'off'}
                      ></UserInfoInput>
                      <p>제목</p>
                      <UserInfoInput
                        id={'title'}
                        placeholder={'사용자 난이도 팝업'}
                        autoComplete={'off'}
                      ></UserInfoInput>

                      <p>담당자</p>
                      <UserInfoInput
                        id={'member'}
                        placeholder={'홍길동'}
                        autoComplete={'off'}
                      ></UserInfoInput>

                      <p>API 링크 주소</p>
                      <UserInfoInput
                        id={'api'}
                        placeholder={
                          'https://rwiki.xxxxxx.com/display/GFX/%5BAPI%5D+GFx_P_CustomDifficultyWidzet.upk'
                        }
                        autoComplete={'off'}
                      ></UserInfoInput>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        id="submit"
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-gray-900 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        등록
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Home;
