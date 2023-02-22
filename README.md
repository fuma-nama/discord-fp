<p align="center">
    <img alt="logo" src="./document/logo.png" width="200" />
    <h1 align="center">Discord-FP</h1>
    <p align="center">A Beautiful Application Command Framework based on <b>Discord.js</b></p>
</p>

## Features

-   **Type-safe**
-   Light-weight
-   High performance
-   Auto-complete & Middlewares
-   File-system Based
-   Beautiful code with Functional Programming
-   Support both **ESM and CommonJS**

## Install

`npm install discord-fp`

> **Note** <br />
> Example below uses commonjs + typescript, you may convert it into normal common js syntax yourself

## Slash command in the Best way

Stop writing lots of `interaction.options.get("name")` just for getting the value of an option

Let us handle **everything!**

```typescript
import { options, slash } from "discord-fp";

export default slash({
    description: "Say Hello to you",
    options: {
        name: options.string({
            description: "Your name",
        }),
    },
    execute: async ({ event, options }) => {
        await event.reply(`Hello, ${options.name}`);
    },
});
```

## Find your Command _Instantly_

Tired of finding your command all the place? All commands are file-system based!

Search file by name, you are able to find your command **instantly**

For slash command: `test hello`

> commands/test/\_meta.ts

```ts
import { group } from "discord-fp";

export default group({
    description: "Your Command Group description",
});
```

> commands/test/hello.ts

```ts
import { slash } from "discord-fp";

export default slash({
    //...
});
```

## Powerful & Beautiful

Not just slash commands, you are able to create context menu commands with **few lines of code**

> commands/Delete Message.ts

```ts
import { message } from "discord-fp";

export default message({
    async execute({ event }) {
        await event.reply("I don't wanna delete message!");
    },
});
```

## Middleware

Wanted to run something before executing a command?

With middleware, you can control how an event handler being fired, or pass context to the handler

> commands/\_meta.ts

```ts
import { initBuilder } from "discord-fp";

export const base = initBuilder();

//Don't return anything to prevent calling the handler
export const safe = base.middleware(({ event, next }) => {
    return next({
        ctx: {
            message: "hello world",
        },
        event,
    });
});
```

> commands/your-command.ts

```ts
export default safe.slash({ ... })
```

## Everything is Type-safe + Null-safe

From config, middleware context, to options values, It's all type-safe!

```ts
export default slash({
    description: "Say Hello to you",
    options: {
        enabled: options.boolean({
            description: "Enabled",
            required: false,
        }),
        number: options.number({
            description: "Example number",
            required: true,
        }),
    },
    //...
});
```

Take a look at `options`:

```
(parameter) options: {
    enabled: boolean | null;
    number: number;
}
```

## Getting Started

Try our [template](https://github.com/SonMooSans/discord-bot-starter) which includes everything you need

Start Discord-FP after the bot is ready

```ts
import { start } from "discord-fp";
import { join } from "path";

client.on("ready", () => {
    start(client, {
        //where to load commands
        load: ["./commands"],
    });
});
```

### Create Slash command

Create a file inside the folder <br />
Since it's file-system based, command name is same as its file name

> commands/hello.ts

```ts
import { slash } from "discord-fp";

export default slash({
    description: "Say Hello World",
    execute: async ({ event, options }) => {
        await event.reply(`Hello World`);
    },
});
```

### Run your bot

Start your bot, and run the slash command in Discord

> hello

Then you should see the bot replied "Hello World"!

## Command Group & Sub commands

You may use command group & sub command for grouping tons of commands

1. Create a folder
2. Create a `_meta.ts` / `meta.js` file
3. Define information for the command group in the `_meta` file

    ```ts
    import { group } from "discord-fp";

    export default group({
        description: "My Command group",
    });
    ```

4. Create commands inside the folder <br />
   **Inside the folder**, Only slash commands are supported

    ```ts
    import { options, slash } from "discord-fp";

    export default slash({
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
import { group } from "discord-fp";

//loader
export default group({
    description: "My Command group",
});
```

## Middleware

Discord-fp provides type-safe middlewares & context with high code quality

In default, we use static builders from `discord-fp`

```ts
import { slash } from "discord-fp";

export default slash({ ... });
```

To enable middleware, you need to use `initBuilder` instead

> commands/\_meta.ts

```ts
import { initBuilder } from "discord-fp";

export const base = initBuilder();
```

To add a middleware:

```ts
export const admin = base.middleware(({ event, next }) => {
    //do some checking...
    return next({
        ctx: {
            message: "context here",
        },
        event,
    });
});
```

Now create a slash command with the middleware enabled:

```ts
import { admin } from "./_meta.js";

export default admin.slash({ ... })
```

### Reject events

You can prevent calling the event handler by returning nothing

```ts
export const admin = base.middleware(({ event, next }) => {
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
export const member = base.middleware(({ event, next }) => {
    return next({
        event,
        ctx: "Hello World",
    });
});

export const admin = member.middleware(({ event, next, ctx }) => {
    //ctx === "Hello World"
    //...
});
```

## Command Options

We provides type-safe options out-of-the-box

```ts
import { options } from "discord-fp";

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
const { start } = require("discord-fp");

start(client, {
    load: ["./commands"],
});
```

### ESM

```ts
import { start } from "discord-fp";

start(client, {
    load: ["./commands"],
});
```

## Any issues?

Feel free to open an issue! <br />
Give this repo a star if you loved this library
