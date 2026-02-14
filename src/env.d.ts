/// <reference types="@cloudflare/workers-types" />

type Runtime = import('@astrojs/cloudflare').Runtime<{
  RATE_LIMIT: import('@cloudflare/workers-types').KVNamespace;
}>;

declare namespace App {
  interface Locals extends Runtime {}
}
