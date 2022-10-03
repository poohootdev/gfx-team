interface JoinInputType {
  label: string;
  type: string;
  placeholder: string;
  joinType: string;
  onChangeX(str: string, value: string): void;
}

const JoinInput = (props: JoinInputType) => {
  const { label, type, placeholder, joinType, onChangeX } = props;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeX(joinType, e.target.value);
  };

  return (
    <div className="mb-3 xl:w-96">
      <p className="mb-4 text-left">{label}</p>
      <input
        type={type}
        className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

JoinInput.defaultProps = {
  label: '',
  type: 'text',
  placeholder: '',
  joinType: '',
};

export default JoinInput;
