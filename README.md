# Discord-FP

A Beautiful Application Command Framework based on **Discord.js**

-   **Type-safe**
-   Light-weight
-   High performance
-   Middlewares
-   File-system Based
-   Beautiful code with Functional Programming

## Install

`npm install discord-fp`

## Slash command in the Best way

Stop writing lots of `interaction.options.get("name")` just for getting the value of an option

Let us handle **everything!**

```typescript
import { options, slash } from "discord-fp";

export default slash({
    description: "Say Hello to you",
    options: {
        name: options
            .string({
                description: "Your name",
            })
            .transform((v) => {
                return `Mr.${v}`;
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
    async execute(e) {
        await e.reply("I don't wanna delete message!");
    },
});
```

## Middleware

Wanted to run something before executing a command?

With middleware, you can control how an event handler being fired

> commands/\_meta.ts

```ts
import type { Middleware } from "discord-fp";

export middleware: Middleware = (e, handler) => {
    if (something) {
        handler(e)
    } else {
        //...
    }
}
```

## Everything is Type-safe + Null-safe

From config to options values, It's all type-safe!

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

Start Discord-FP after the bot is ready

```ts
import { start } from "discord-fp";
import { join } from "path";

client.on("ready", () => {
    start(client, {
        //where to load commands
        dir: join(__dirname, "commands"),
    });
});
```

### Create Slash command

Create a file inside the folder

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

By defining **middleware** and **loader**, you can customize almost everything

For example, Command group is just a type of loader

```ts
import { Middleware, group } from "discord-fp";

//loader
export default group({
    description: "My Command group"
})

//middleware
export middleware: Middleware = (e, handler) => {
    return handler(e)
}
```

## Any issues?

Feel free to open an issue! <br />
Give this repo a star if you loved this library
