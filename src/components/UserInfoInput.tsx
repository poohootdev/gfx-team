interface UserInfoType {
  readonly id: string;
  className?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  warnigMsg?: string;
}

const defaultProps = {
  id: '',
  className: 'mb-4',
  type: 'text',
  placeholder: '',
  autoComplete: 'on',
  warnigMsg: '',
};

const UserInfoInput = (props: UserInfoType) => {
  const { id, className, type, placeholder, autoComplete, warnigMsg } = props;

  return (
    <div className={className}>
      <input
        id={id}
        className="mt-1 w-full rounded-md"
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {warnigMsg ? (
        <div id="id-msg" className="mt-1 mb-3 text-xs text-red-500">
          {warnigMsg}
        </div>
      ) : null}
    </div>
  );
};

UserInfoInput.defaultProps = defaultProps;

export default UserInfoInput;
