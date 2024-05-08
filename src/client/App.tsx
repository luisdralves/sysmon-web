import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import './App.css';
import { fetchDynamicData, fetchHistoryData, fetchStaticData } from './api';
import { historyAtom } from './atoms';
import { Cpu } from './components/chart-cards/cpu';
import { Disks } from './components/chart-cards/disks';
import { Memory } from './components/chart-cards/memory';
import { Network } from './components/chart-cards/network';
import { Static } from './components/chart-cards/static';
import { Temps } from './components/chart-cards/temps';
import { useSetTheme } from './hooks/use-set-theme';

const serverSteps = Number(import.meta.env.SERVER_STEPS);
const serverRefreshInterval = Number(import.meta.env.SERVER_REFRESH_INTERVAL);
const refetchInterval = Number(import.meta.env.CLIENT_REFETCH_INTERVAL);

const queryClient = new QueryClient();

const Main = () => {
  const history = useRef<HistoryNormalized>(null!);
  const setHistoryRef = useSetAtom(historyAtom);
  const staticQuery = useQuery({
    queryKey: ['static'],
    queryFn: fetchStaticData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const data = await fetchHistoryData();
      const maxes = {} as HistoryNormalized['maxes'];

      for (const key of ['net', 'disks', 'temps'] as const) {
        maxes[key] = data.reduce((max, slice) => Math.max(max, ...slice[key]), 0);
      }

      history.current = {
        data,
        maxes,
      };
      return data;
    },
  });

  const dynamicQuery = useQuery({
    queryKey: ['dynamic'],
    queryFn: async () => {
      const data = await fetchDynamicData();

      if (history.current) {
        while (
          history.current.data.length &&
          history.current.data[0].timestamp < Date.now() - (serverSteps + 3) * serverRefreshInterval
        ) {
          history.current.data.shift();
        }

        history.current.data.push(data);

        for (const key of ['net', 'disks', 'temps'] as const) {
          history.current.maxes[key] = history.current.data.reduce((max, slice) => Math.max(max, ...slice[key]), 0);
        }
      }

      return data;
    },
    refetchInterval: refetchInterval,
    retry: true,
  });

  useSetTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => setHistoryRef(history), [setHistoryRef]);

  const isLoading = staticQuery.isLoading || dynamicQuery.isLoading || historyQuery.isLoading;

  return (
    !isLoading && (
      <>
        <Static />
        <Cpu />
        <Memory />
        <Network />
        <Disks />
        <Temps />
      </>
    )
  );
};

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <Main />
  </QueryClientProvider>
);
