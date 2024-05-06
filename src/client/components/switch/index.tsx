import type { ComponentPropsWithoutRef } from 'react';
import './index.css';

type Props = ComponentPropsWithoutRef<'input'> & {
  label: string;
};

export const Switch = ({ label, ...rest }: Props) => {
  return (
    <label className='switch-wrapper'>
      <span className={'switch'}>
        <input {...rest} type='checkbox' />
        <span className='slider' />
      </span>
      {label}
    </label>
  );
};
