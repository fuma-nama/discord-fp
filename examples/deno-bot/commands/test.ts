import { dfp } from "../main.ts";

export default dfp.command.slash({
    description: "test",
    execute: (ctx) => {
        console.log(ctx.event.id);
    },
});
