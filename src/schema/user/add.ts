import { Type } from "@sinclair/typebox";

import { defineEndpoint } from "@/generator-helpers.js";
import { privateUser } from "@/schema/definitions/privateUser";

export default defineEndpoint({
    source: "server",
    target: "user",
    description:
        "Contains the full state of users that the client has just subscribed to. This event should always precede [update](#update) events which contain partial updates of how users have changed.",
    event: {
        data: Type.Object({
            users: Type.Array(Type.Ref(privateUser)),
        }),
    },
});