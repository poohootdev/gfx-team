interface SvgType {
  width?: string;
  height?: string;
  viewBox?: string;
  labelledby?: string;
  preserveAspectRatio?: string;
  d: string;
  fill: string;
}

const defaultProps = {
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  labelledby: '',
  preserveAspectRatio: 'xMidYMid meet',
  d: '',
  fill: '#ffffff',
};

const SvgSoket = (props: SvgType) => {
  const { width, height, viewBox, labelledby, preserveAspectRatio, d, fill } = props;

  return (
    <svg
      xmlns="https://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      aria-labelledby={labelledby}
      preserveAspectRatio={preserveAspectRatio}
    >
      <g fill={fill}>
        <path d={d} />
      </g>
    </svg>
  );
};

SvgSoket.defaultProps = defaultProps;
export default SvgSoket;
