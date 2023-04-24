# Discord-FP for Discordeno

## Install

```
npm install @discord-fp/discordeno
```

## Getting Started

Try our [example](/examples/discordeno-bot) which includes everything you need

Create Discordeno client

> `index.ts`

```ts
import "dotenv/config";
import { createBot, startBot } from "discordeno";

//store your token in environment variable or put it here
const token = process.env["TOKEN"]!;

export const bot = createBot({
    token,
});

startBot(bot);
```

Init Discord-FP and export it

> `index.ts`

```ts
import "dotenv/config";
import { initDiscordFP } from "@discord-fp/discordeno";
import { createBot, startBot } from "discordeno";

//store your token in environment variable or put it here
const token = process.env["TOKEN"]!;
const dfp = initDiscordFP();

export const bot = createBot({
    token,
});

export const command = dfp.command;

dfp.start({
    bot,
    load: ["./commands"],
});

startBot(bot);
```

### Create Slash command

Create a file inside the `commands` folder <br />
Since it's file-system based, command name is same as its file name

> commands/hello.ts

```ts
import { InteractionResponseTypes, sendInteractionResponse } from "discordeno";
import { command } from "../index.ts";

export default command.slash({
    description: "Say Hello to you",
    execute: async ({ event }) => {
        await sendInteractionResponse(bot, event.id, event.token, {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data: {
                content: `Hello World`,
            },
        });
    },
});
```

### Run your bot

Start your bot, and run the slash command in Discord

Then you should see the bot replied "Hello World"!

## Command Group & Sub commands

You may use a command group or sub command for grouping tons of commands

1. Create a folder
2. Create a `_meta.ts` / `meta.js` file
3. Define information for the command group in the `_meta` file

    ```ts
    import { command } from "../index.ts";

    export default command.group({
        description: "My Command group",
    });
    ```

4. Create commands inside the folder <br />
   **Inside the folder**, Only slash commands are supported

    ```ts
    import { command } from "../index.ts";
    import { options } from "@discord-fp/discordeno";

    export default command.slash({
        description: "Say Hello World",
        execute: async ({ event }) => {
            //do something
        },
    });
    ```

### What is \_meta.ts & \_meta.js ?

You may create a `_meta` file for controling how the folder being loaded

For example, Command group is just a type of loader

```ts
import { command } from "../index.ts";

//loader
export default command.group({
    description: "My Command group",
});
```

## Middleware

Discord-FP provides type-safe middlewares & context with high code quality

On the Discord-FP init script:

> index.ts

```ts
import { initDiscordFP } from "@discord-fp/discordeno";
import { client } from "./discord.js";

export const dfp = initDiscordFP();

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
import { protectedCommand } from "../index.ts";

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
import { options } from "@discord-fp/discordeno";

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
    autoComplete(e) {
        sendInteractionResponse(bot, e.id, e.token, {
            type: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
            data: {
                choices: [{ name: "Mom", value: "Dad" }],
            },
        });
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

## Notice

Currently Discord-FP doesn't compatible with Deno
