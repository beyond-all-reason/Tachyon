import { Type } from "@sinclair/typebox";

import { defineEndpoint } from "@/helpers";
import { email, username } from "@/schema/types";

export default defineEndpoint({
    description: `Registers a new account. The user's password should be hashed twice, once on the client (md5), then again on the server (something stronger) before being stored.\n\nThe server implementation may wish to verify the account by sending a verification link to the email address. \`hashedPassword\` implies that the user's password should be hashed twice, once on the client-side, and then again on the server. Doing this ensures even the server can never know the user's plaintext password.`,
    requiresLogin: false,
    order: 1,
    request: {
        data: Type.Object(
            {
                email: email,
                username: username,
                password: Type.String(),
            },
            {
                examples: [
                    {
                        email: "bob@test.com",
                        username: "bob",
                        password: "plsnerfconsuls",
                    },
                ],
            }
        ),
    },
    response: [
        {
            status: "success",
            data: Type.Object({
                verificationRequired: Type.Boolean({
                    description:
                        "If enabled, the server should email users a one-time verification link.",
                }),
            }),
        },
        { status: "failed", reason: "email_taken" },
        { status: "failed", reason: "username_taken" },
        { status: "failed", reason: "invalid_email" },
        { status: "failed", reason: "weak_password" },
        { status: "failed", reason: "username_profanity" },
    ],
});
