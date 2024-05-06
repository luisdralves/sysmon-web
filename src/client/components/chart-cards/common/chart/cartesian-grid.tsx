const width = 640;
const height = 480;

export const CartesianGrid = () => (
  <svg
    className='cartesian-grid'
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    width='100%'
    height='100%'
    viewBox={`0 0 ${width} ${height}`}
    preserveAspectRatio='none'
    vectorEffect='non-scaling-stroke'
  >
    <title>{'Cartesian grid'}</title>

    {Array.from({ length: 5 }).map((_, index) => (
      <line
        x1={'0'}
        x2={'100%'}
        // biome-ignore lint/suspicious/noArrayIndexKey: supress react console error
        key={index}
        y1={Math.max(1, Math.min(height - 1, (height * index) / 4))}
        y2={Math.max(1, Math.min(height - 1, (height * index) / 4))}
        stroke='var(--color-background1)'
        strokeWidth={1}
      />
    ))}
  </svg>
);
