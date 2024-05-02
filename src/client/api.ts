const getApiUrl = (path: string) => {
  const url = new URL(window.location.href);
  url.port = '3001';
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
