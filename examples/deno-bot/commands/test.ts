import { dfp } from "../main.ts";

export default dfp.command.slash({
    description: "test",
    execute: ({ event }) => {
        console.log(event.id);
    },
});
