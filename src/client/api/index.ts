const getApiUrl = (path: string) => {
  let url: URL;
  try {
    url = new URL(import.meta.env.SERVER_DEPLOY_URL as string);
  } catch {
    url = new URL(window.location.href);
    url.port = import.meta.env.SERVER_PORT;
  }

  url.pathname = path;

  return url;
};

export const fetchStaticData = async (): Promise<StaticData> => {
  const response = await fetch(getApiUrl('/api/static'));
  return await response.json();
};

export const fetchHistoryData = async (): Promise<HistorySlice[]> => {
  const response = await fetch(getApiUrl('/api/history'));
  return await response.json();
};

export const fetchDynamicData = async (): Promise<HistorySlice> => {
  const response = await fetch(getApiUrl('/api/dynamic'));
  return await response.json();
};
