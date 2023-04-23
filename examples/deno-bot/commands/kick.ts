import { command } from "../main.ts";
export default command.message({
    execute: ({ event }) => {
        console.log("test", event);
    },
});
