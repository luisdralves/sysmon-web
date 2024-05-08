import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from '@tanstack/react-query';
import './App.css';
import { fetchDynamicData, fetchHistoryData, fetchStaticData } from './api';
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
  const queryClient = useQueryClient();
  const staticQuery = useQuery({
    queryKey: ['static'],
    queryFn: fetchStaticData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const historyQuery = useQuery({
    queryKey: ['history'],
    queryFn: fetchHistoryData,
  });

  const dynamicQuery = useQuery({
    queryKey: ['dynamic'],
    queryFn: async () => {
      const data = await fetchDynamicData();
      queryClient.setQueryData(['history'], (historyOld: HistorySlice[]) => {
        const history = historyOld.slice();
        while (history.length && history[0].timestamp < Date.now() - (serverSteps + 3) * serverRefreshInterval) {
          history.shift();
        }

        history.push(data);
        return history;
      });
      return data;
    },
    refetchInterval: refetchInterval,
  });

  useSetTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);

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
