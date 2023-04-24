# Discord-FP for Discord.js

## Install

```
npm install @discord-fp/djs
```

## Getting Started

Try our [template](https://github.com/SonMooSans/discord-bot-starter) which includes everything you need

Create Discord.js client

> `utils/discord.ts`

```ts
import { Client, GatewayIntentBits } from "discord.js";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
```

Init Discord-FP

> `utils/dfp.ts`

```ts
import { initDiscordFP } from "@discord-fp/djs";
import { client } from "./discord";

export const dfp = initDiscordFP();
export const command = dfp.command;
```

Start Discord-FP after the bot is ready

> `index.ts`

```ts
import { client } from "./utils/discord";
import { dfp } from "./utils/dfp";

client.on("ready", () => {
    dfp.start({
        //the discord.js client
        client,
        //where to load commands
        load: ["./commands"],
    });
});

client.login("token");
```

### Create Slash command

Create a file inside the folder <br />
Since it's file-system based, command name is same as its file name

> commands/hello.ts

```ts
import { command } from "@/utils/dfp";

export default command.slash({
    description: "Say Hello World",
    execute: async ({ event }) => {
        await event.reply(`Hello World`);
    },
});
```

### Run your bot

Start your bot, and run the slash command in Discord

Then you should see the bot replied "Hello World"!

## Command Group & Sub commands

You may use command group & sub command for grouping tons of commands

1. Create a folder
2. Create a `_meta.ts` / `meta.js` file
3. Define information for the command group in the `_meta` file

    ```ts
    import { command } from "@/utils/dfp";

    export default command.group({
        description: "My Command group",
    });
    ```

4. Create commands inside the folder <br />
   **Inside the folder**, Only slash commands are supported

    ```ts
    import { command } from "@/utils/dfp";
    import { options } from "@discord-fp/djs";

    export default command.slash({
        description: "Say Hello World",
        execute: async ({ event, options }) => {
            await event.reply(`Hello World`);
        },
    });
    ```

### What is \_meta.ts & \_meta.js ?

You may create a `_meta` file for controling how the folder being loaded

For example, Command group is just a type of loader

```ts
import { command } from "@/utils/dfp";

//loader
export default command.group({
    description: "My Command group",
});
```

## Middleware

Discord-FP provides type-safe middlewares & context with high code quality

On the Discord-FP init script:

> utils/dfp.ts

```ts
import { initDiscordFP } from "@discord-fp/djs";
import { client } from "./discord.js";

export const dfp = initDiscordFP({
    client,
});

export const command = dfp.command;

//new middleware
export const protectedCommand = dfp.command.middleware(({ event, next }) => {
    //check permissions

    return next({
        ctx: {
            message: "hello world",
        },
        event,
    });
});
```

Now create a slash command with the middleware enabled:

```ts
import { protectedCommand } from "@/utils/dfp";

export default protectedCommand.slash({ ... })
```

### Reject events

You can prevent calling the event handler by returning nothing

```ts
dfp.command.middleware(({ event, next }) => {
    if (isInvalid(event)) return;

    return next({
        ctx: {
            message: "context here",
        },
        event,
    });
});
```

### Nested Middlewares

Discord-FP also allows you to create nested middlewares

```ts
export const memberCommand = dfp.command.middleware(({ event, next }) => {
    return next({
        event,
        ctx: "Hello World",
    });
});

export const adminCommand = memberCommand.middleware(({ event, next, ctx }) => {
    //ctx === "Hello World"
    //...
});
```

## Command Options

We provides type-safe options out-of-the-box

```ts
import { options } from "@discord-fp/djs";

options.string({
    description: "Your name",
    required: false,
});
```

### Auto-complete

Enable auto-complete _easily_

```ts
options.string({
    description: "Your name",
    required: false,
    autoComplete(e) {
        const items = ["hello", "world"];
        const v = e.options.getFocused();

        e.respond(result);
    },
});
```

### Transform

Make your code even better with `transform`

```ts
options.string({
    description: "Your name",
    require: true,
}).transform((v) => {
   return `Mr.${v}`;
}),
//Transform "Henry" -> "Mr.Henry"
```

## ESM Usage

ESM has been supported since v0.2.1

> **Note** <br />
> If you have any problems with relative path, you may pass an absolute path instead

### Common js

```ts
const { ... } = require("@discord-fp/djs");
```

### ESM

```ts
import { ... } from "@discord-fp/djs";
```
