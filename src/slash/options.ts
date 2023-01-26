import { makeOption } from "./option";
import {
    string,
    role,
    mention,
    boolean,
    number,
    int,
    attachment,
    channel,
    user,
} from "./options/index";

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
