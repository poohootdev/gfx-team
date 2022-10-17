import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';

interface JoinInputType {
  label: string;
  type: string;
  placeholder: string;
  joinType: string;
  joinInputRef?: React.RefObject<HTMLDivElement>;
  onChangeX(str: string, value: string): void;
}

const JoinInput = forwardRef(function JoinInput(props: JoinInputType, ref?: React.Ref<unknown>) {
  const { label, type, placeholder, joinType, onChangeX, joinInputRef } = props;
  const [warningMsg, setWarningMsg] = useState('');
  const ref_warningMsg = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    handleWarningMsg: (msg: string) => handleWarningMsg(msg),
  }));

  function handleWarningMsg(msg: string): void {
    if (ref_warningMsg.current) {
      ref_warningMsg.current.style.display = msg.length > 0 ? 'block' : 'none';
      setWarningMsg(msg);
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeX(joinType, e.target.value);
  };

  return (
    <div className="mb-3 xl:w-96" ref={joinInputRef}>
      <p className="mb-4 text-left text-gray-300 text-sm font-medium">{label}</p>
      <input
        type={type}
        //className="form-control block w-full px-3 py-2 rounded-md text-sm font-medium text-gray-500 bg-white bg-clip-padding border border-gray-300 transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none"
        className="block w-full px-3 py-2 rounded-md text-sm font-medium text-gray-500 
        focus:outline-none"
        onChange={onChange}
        placeholder={placeholder}
      />
      <div ref={ref_warningMsg} className="none text-amber-500 py-2">
        {warningMsg}
      </div>
    </div>
  );
});

JoinInput.defaultProps = {
  label: '',
  type: 'text',
  placeholder: '',
  joinType: '',
  joinInputRef: React.createRef(),
};

export default JoinInput;
