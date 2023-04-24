<p align="center">
    <img alt="logo" src="./document/logo.png" width="200" />
    <h1 align="center">Discord-FP</h1>
    <p align="center">A Beautiful Application Command Framework For <b>Discordeno & Discord.js</b></p>
</p>

## Features

-   **Type-safe**
-   Light-weight
-   High performance
-   Auto-complete & Middlewares
-   File-system Based
-   Beautiful code with Functional Programming
-   Support both **Discordeno and Discord.js**
-   Compatible with **ESM and CommonJS**

## Install

### Discordeno

Refer to [here](./packages/discordeno/README.md) for Documentation of Discord-FP for discordeno

```
npm install @discord-fp/discordeno
```

### Discord.js

```
npm install @discord-fp/djs
```

> **Note** <br />
> Example below uses commonjs + typescript + import alias <br />
> you may convert it into normal common js syntax yourself

## Slash command in the Best way

Stop writing lots of `interaction.options.get("name")` just for getting the value of an option

Let us handle **everything!**

```typescript
import { options } from "@discord-fp/djs";
import { command } from "@/utils/dfp";

export default command.slash({
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
import { command } from "@/utils/dfp";

export default command.group({
    description: "Your Command Group description",
});
```

> commands/test/hello.ts

```ts
import { command } from "@/utils/dfp";

export default command.slash({
    //...
});
```

## Powerful & Beautiful

Not just slash commands, you are able to create context menu commands with **few lines of code**

> commands/Delete Message.ts

```ts
import { command } from "@/utils/dfp";

export default command.message({
    async execute({ event }) {
        await event.reply("I don't wanna delete message!");
    },
});
```

## Middleware

Wanted to run something before executing a command?

With middleware, you can control how an event handler being fired, or pass context to the handler

> utils/dfp.ts

```ts
import { initDiscordFP } from "@discord-fp/djs";

export const dfp = initDiscordFP();
export const command = dfp.command;

//Don't return anything to prevent calling the handler
export const protectedCommand = command.middleware(({ event, next }) => {
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
import { protectedCommand } from "@/utils/dfp";

export default protectedCommand.slash({ ... })
```

## Everything is Type-safe + Null-safe

From config, middleware context, to options values, It's all type-safe!

```ts
export default command.slash({
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

| Discord.js                       | Discordeno                              |
| -------------------------------- | --------------------------------------- |
| [Docs](./packages/djs/README.md) | [Docs](./packages/discordeno/README.md) |

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

## Any issues?

Feel free to open an issue! <br />
Give this repo a star if you loved this library
