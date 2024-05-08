/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly SERVER_STEPS: string;
  readonly CLIENT_PORT: string;
  readonly CLIENT_REFETCH_INTERVAL: string;
  readonly SERVER_DEPLOY_URL?: string;
  readonly SERVER_PORT: string;
  readonly SERVER_REFRESH_INTERVAL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
