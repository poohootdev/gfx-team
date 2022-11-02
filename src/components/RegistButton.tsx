import SvgSoket from './SvgSoket';

const RegistButton = () => {
  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <div className="relative">
      <div className="fixed bottom-0 right-0 h-16 w-16">
        <div onClick={handleOnClick}>
          <div className="absolute left-0 top-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
              <g fill="#000000">
                <circle cx="12" cy="12" r="12" />
              </g>
            </svg>
          </div>
          <div className="absolute left-0 top-0">
            <SvgSoket
              width={'40'}
              height={'40'}
              viewBox={'-2 -2 27 27'}
              d={
                'M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z'
              }
              fill="#ffffff"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistButton;
