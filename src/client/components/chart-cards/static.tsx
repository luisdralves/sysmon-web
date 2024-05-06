import { useAnimationFrame } from '@/hooks/use-animation-frame';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { Switch } from '../switch';

const formatUptime = (value: number) => {
  const seconds = String(Math.floor(value % 60)).padStart(2, '0');
  const minutes = String(Math.floor((value / 60) % 60)).padStart(2, '0');
  const hours = String(Math.floor((value / (60 * 60)) % 24)).padStart(2, '0');
  const days = Math.floor((value / (60 * 60 * 24)) % 365);
  const years = Math.floor(value / (60 * 60 * 24 * 365));

  let formatted = '';

  if (years >= 1) {
    formatted += `${years}y `;
  }

  if (days >= 1 || years >= 1) {
    formatted += `${days}d `;
  }

  return `${formatted}${hours}:${minutes}:${seconds}`;
};

const Uptime = ({ boot_time }: Pick<StaticData, 'boot_time'>) => {
  const [uptime, setUptime] = useState(formatUptime(Date.now() / 1000 - boot_time));

  useAnimationFrame(() => setUptime(formatUptime(Date.now() / 1000 - boot_time)), 1);

  return (
    <>
      <small>Uptime</small>
      <h3>{uptime}</h3>
    </>
  );
};

export const Static = () => {
  const { data: staticData } = useQuery<StaticData>({ queryKey: ['static'] });
  const root = useRef(document.getElementById('root')!);
  const [dark, setDark] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    root.current.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    staticData && (
      <div>
        <h2>{staticData.host_name}</h2>

        <small>OS</small>
        <h3>
          {staticData.name} {staticData.os_version}
        </h3>

        <small>Kernel</small>
        <h3>{staticData.kernel_version}</h3>
        {staticData.boot_time && <Uptime boot_time={staticData.boot_time} />}

        <Switch
          checked={dark}
          label={`${dark ? 'Dark' : 'Light'} theme`}
          onChange={({ target }) => setDark(target.checked)}
        />
      </div>
    )
  );
};
