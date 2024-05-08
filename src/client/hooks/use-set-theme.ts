import { useEffect } from 'react';

export const useSetTheme = (dark?: boolean) => {
  useEffect(() => {
    document.getElementById('root')!.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);
};
