import { makeOption } from "./options/base.js";
import { string } from "./options/string.js";
import { role } from "./options/role.js";
import { mention } from "./options/mention.js";
import { boolean } from "./options/boolean.js";
import { number } from "./options/number.js";
import { int } from "./options/int.js";
import { attachment } from "./options/attachment.js";
import { channel } from "./options/channel.js";
import { user } from "./options/user.js";

export const options = {
    custom: makeOption,
    string,
    role,
    user,
    int,
    number,
    channel,
    attachment,
    boolean,
    mention,
};
