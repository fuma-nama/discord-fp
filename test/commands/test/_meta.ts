import { group, Middleware } from "../../../src/index.js";

export default group({
    description: "Test commands",
});

export const middleware: Middleware = async (e, handler) => {
    console.log("middleware triggied");
    await handler(e);
};
