import {
  createRequestHandler,
  unstable_createContext,
} from "react-router";

// Typed context for accessing Cloudflare bindings in loaders/actions
export const cloudflareContext = unstable_createContext<{
  env: Env;
  ctx: ExecutionContext;
}>();

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

export default {
  fetch(request, env, ctx) {
    // Pass as Map entries — the request handler wraps this in unstable_RouterContextProvider
    const initialContext = new Map([[cloudflareContext, { env, ctx }]]);
    return requestHandler(request, initialContext);
  },
} satisfies ExportedHandler<Env>;
