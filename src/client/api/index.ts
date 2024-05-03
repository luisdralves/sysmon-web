const getApiUrl = (path: string) => {
  const url = new URL(window.location.href);
  url.port = import.meta.env.SERVER_PORT;
  url.pathname = path;

  return url;
};

export const fetchStaticData = async (): Promise<StaticData> => {
  const response = await fetch(getApiUrl('/api/static'));
  return await response.json();
};

export const fetchDynamicData = async (): Promise<DynamicData> => {
  const response = await fetch(getApiUrl('/api/dynamic'));
  return await response.json();
};
