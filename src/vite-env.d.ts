/// <reference types="vite/client" />

export {};

 
interface ImportMetaEnv {
  readonly [key: `VITE_${string}`]: string;
}

interface ImportMeta {
readonly env: ImportMetaEnv;
}
