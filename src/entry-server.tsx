import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { StrictMode } from "react";
import App from "./App";

type HelmetCtx = { helmet?: HelmetServerState };

export type RenderResult = {
  html: string;
  helmet: HelmetServerState | undefined;
};

export function render(url: string): RenderResult {
  const helmetContext: HelmetCtx = {};
  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );
  return { html, helmet: helmetContext.helmet };
}
