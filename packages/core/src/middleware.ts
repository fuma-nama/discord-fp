type MiddlewareInput<E, Context> = {
    event: E;
    ctx: Context;
};

type MiddlewareOutput<E, Context> = {
    event: E;
    ctx: Context;
};

export type MiddlewareFn<Event, Context, ContextOut> = {
    (opts: {
        event: Event;
        ctx: Context;
        next: {
            (): Promise<MiddlewareOutput<Event, Context> | void>;
            <$Context>(
                e: MiddlewareInput<Event, $Context>
            ): Promise<MiddlewareOutput<Event, $Context> | void>;
        };
    }): Promise<MiddlewareOutput<Event, ContextOut> | void> | void;
};

export async function executeWithMiddleware<E>(
    event: E,
    middlewares: MiddlewareFn<E, any, any>[],
    callback: (e: MiddlewareInput<E, any>) => void | Promise<void>
) {
    const callRecursive = async (
        index: number,
        last: MiddlewareOutput<E, any>
    ): Promise<MiddlewareOutput<E, any> | void> => {
        const fn = middlewares[index];

        if (fn == null) {
            await callback({
                event: last.event as E,
                ctx: last.ctx,
            });

            return;
        }

        const result = await fn({
            event: last.event,
            ctx: last.ctx,
            next<$Context>(opts?: MiddlewareInput<E, $Context>) {
                const nextOpts =
                    opts == null
                        ? last
                        : {
                              event: opts.event as E,
                              ctx: opts.ctx,
                          };

                return callRecursive(index + 1, nextOpts);
            },
        });

        if (result != null) return result;
    };

    await callRecursive(0, {
        event,
        ctx: {},
    });
}
