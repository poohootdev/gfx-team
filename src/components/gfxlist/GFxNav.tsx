interface PropType {
  changeMenu(name: string): void;
}

const UINav = (props: PropType) => {
  const { changeMenu } = props;

  const sendCallBack = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    changeMenu(event.currentTarget.name);
  };

  return (
    <nav className="flex w-full bg-gray-900 h-12 text-[#ebe8e2]">
      <button name="subject" onClick={sendCallBack} className="flex-1 border-r-2">
        <b>제목</b>
      </button>
      <button name="fla" onClick={sendCallBack} className="flex-1 border-r-2">
        <b>Fla</b>
      </button>
      <button name="member" onClick={sendCallBack} className="flex-initial border-r-2 w-32">
        <b>담당자</b>
      </button>
      <button name="api" onClick={sendCallBack} className="flex-1 border-r-2">
        <b>API</b>
      </button>
      <div className="flex-initial w-16">
        <div className="flex justify-center items-center h-full">
          <b>설정</b>
        </div>
      </div>
    </nav>
  );
};

export default UINav;
