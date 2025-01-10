import { performance } from "node:perf_hooks";
import type { Middleware } from "grammy";
import type { MyContext } from "bot/context";
import { getUpdateInfo } from "bot/helpers";

export function updateLogger(): Middleware<MyContext> {
  return async (ctx, next) => {
    ctx.api.config.use((previous, method, payload, signal) => {
      ctx.logger.debug({
        msg: "bot api call",
        method,
        payload,
      });

      return previous(method, payload, signal);
    });

    ctx.logger.debug({
      msg: "update received",
      update: getUpdateInfo(ctx),
    });

    const startTime = performance.now();
    try {
      await next();
    } finally {
      const endTime = performance.now();
      ctx.logger.debug({
        msg: "update processed",
        duration: endTime - startTime,
      });
    }
  };
}
