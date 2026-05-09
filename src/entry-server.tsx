import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { StrictMode } from "react";
import App from "./App";

type HelmetCtx = { helmet?: HelmetServerState };

export type RenderResult = {
  html: string;
  helmet: HelmetServerState | undefined;
};

// Minimal duck-typed Writable so we don't have to import `node:stream` (which
// would force node types into the app tsconfig). renderToPipeableStream only
// calls `.write(chunk)` and `.end()` and listens via the `pipe()` consumer.
type ChunkSink = {
  write(chunk: Uint8Array | string): boolean;
  end(): void;
  on(event: "drain" | "finish" | "error", cb: () => void): void;
};

function makeStringSink(): ChunkSink & { toString(): string } {
  const chunks: string[] = [];
  const decoder = new TextDecoder("utf-8");
  const finishHandlers: Array<() => void> = [];
  return {
    write(chunk) {
      if (typeof chunk === "string") {
        chunks.push(chunk);
      } else {
        chunks.push(decoder.decode(chunk, { stream: true }));
      }
      return true;
    },
    end() {
      // Flush any remaining bytes in the decoder.
      chunks.push(decoder.decode());
      for (const cb of finishHandlers) cb();
    },
    on(event, cb) {
      if (event === "finish") finishHandlers.push(cb);
    },
    toString() {
      return chunks.join("");
    },
  };
}

export function render(url: string): Promise<RenderResult> {
  const helmetContext: HelmetCtx = {};
  return new Promise((resolvePromise, rejectPromise) => {
    const sink = makeStringSink();
    let didError: unknown = null;

    const { pipe } = renderToPipeableStream(
      <StrictMode>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </StrictMode>,
      {
        // onAllReady fires only after every Suspense boundary in the tree
        // has resolved. That gives us a fully-baked HTML string with the
        // lazy-loaded page content actually rendered, rather than the
        // Suspense fallbacks. Lighthouse + crawlers see the real content.
        onAllReady() {
          sink.on("finish", () => {
            if (didError) {
              rejectPromise(didError);
            } else {
              resolvePromise({ html: sink.toString(), helmet: helmetContext.helmet });
            }
          });
          // The cast is safe — pipe only uses the methods on ChunkSink.
          pipe(sink as unknown as NodeJS.WritableStream);
        },
        onError(err) {
          didError = err;
        },
      },
    );
  });
}
