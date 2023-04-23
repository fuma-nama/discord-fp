import { dfp } from "../../main.ts";
import { options } from "discordfp";

export default dfp.command.slash({
    description: "test",
    options: {
        name: options.string({
            description: "Name",
            minLen: 2,
        }),
        user: options.user({
            description: "User",
            required: false,
        }),
    },
    execute: ({ event, options }) => {
        console.log(event.id, options.user, options.user.member);
    },
});
