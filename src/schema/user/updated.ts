import { Type } from "@sinclair/typebox";

import { defineEndpoint } from "@/generator-helpers.js";
import { user } from "@/schema/definitions/user";
import { userId } from "@/schema/definitions/userId";

export default defineEndpoint({
    source: "server",
    target: "user",
    description:
        "Sent by the server to inform the client of subscribed users state changes. The root object of each array element in `users` is partial, meaning only the elements present have changed, and anything missing is assumed to be unchanged.",
    event: {
        data: Type.Object({
            users: Type.Array(Type.Partial(Type.Deref(user, [user, userId]))),
        }),
    },
});
