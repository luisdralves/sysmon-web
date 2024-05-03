import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import './App.css';
import { fetchDynamicData, fetchStaticData } from './api';
import { Cpu } from './components/chart-cards/cpu';
import { Disks } from './components/chart-cards/disks';
import { Memory } from './components/chart-cards/memory';
import { Network } from './components/chart-cards/network';
import { Static } from './components/chart-cards/static';
import { Temps } from './components/chart-cards/temps';

const queryClient = new QueryClient();

const Main = () => {
  const staticQuery = useQuery({
    queryKey: ['static'],
    queryFn: fetchStaticData,
  });

  const dynamicQuery = useQuery({
    queryKey: ['dynamic'],
    queryFn: fetchDynamicData,
    refetchInterval: Number(import.meta.env.CLIENT_REFETCH_INTERVAL),
  });

  const isLoading = staticQuery.isLoading || dynamicQuery.isLoading;

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
