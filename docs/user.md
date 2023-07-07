# user

- [register](#register)
- [getToken](#getToken)
- [login](#login)
- [recover](#recover)
- [rename](#rename)
---

## register

Registers a new account. The user's password should be hashed twice, once on the client, then again on the server before being stored.

The server implementation may wish to verify the account by sending a verification link to the email address.

### request

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/register/request",
    "type": "object",
    "properties": {
        "command": {
            "const": "user/register/request",
            "type": "string"
        },
        "data": {
            "examples": [
                {
                    "email": "bob@test.com",
                    "username": "bob",
                    "hashedPassword": "1b311ff1a6af12fba8720bd2ce02c960"
                }
            ],
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "username": {
                    "minLength": 3,
                    "maxLength": 20,
                    "pattern": "^[A-Za-z0-9_-]+$",
                    "examples": [
                        "Bob"
                    ],
                    "type": "string"
                },
                "hashedPassword": {
                    "type": "string"
                }
            },
            "required": [
                "email",
                "username",
                "hashedPassword"
            ]
        }
    },
    "required": [
        "command",
        "data"
    ]
}
```

</details>

#### TypeScript Definition
```ts
export interface UserRegisterRequest {
    command: "user/register/request";
    data: {
        email: string;
        username: string;
        hashedPassword: string;
    };
}

```
#### Example
```json
{
    "command": "user/register/request",
    "data": {
        "email": "bob@test.com",
        "username": "bob",
        "hashedPassword": "1b311ff1a6af12fba8720bd2ce02c960"
    }
}
```
### response

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/register/response",
    "anyOf": [
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/register/response",
                    "type": "string"
                },
                "status": {
                    "const": "success",
                    "type": "string"
                }
            },
            "required": [
                "command",
                "status"
            ]
        },
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/register/response",
                    "type": "string"
                },
                "status": {
                    "const": "failed",
                    "type": "string"
                },
                "reason": {
                    "anyOf": [
                        {
                            "const": "email_taken",
                            "type": "string"
                        },
                        {
                            "const": "username_taken",
                            "type": "string"
                        },
                        {
                            "const": "invalid_email",
                            "type": "string"
                        },
                        {
                            "const": "weak_password",
                            "type": "string"
                        },
                        {
                            "const": "username_profanity",
                            "type": "string"
                        },
                        {
                            "const": "internal_error",
                            "type": "string"
                        }
                    ]
                }
            },
            "required": [
                "command",
                "status",
                "reason"
            ]
        }
    ]
}
```

</details>

#### TypeScript Definition
```ts
export type UserRegisterResponse =
    | {
          command: "user/register/response";
          status: "success";
      }
    | {
          command: "user/register/response";
          status: "failed";
          reason:
              | "email_taken"
              | "username_taken"
              | "invalid_email"
              | "weak_password"
              | "username_profanity"
              | "internal_error";
      };

```
#### Example
```json
{
    "command": "user/register/response",
    "status": "success"
}
```
---

## getToken

Get an authentication token used for [login](#login).

### request

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/getToken/request",
    "type": "object",
    "properties": {
        "command": {
            "const": "user/getToken/request",
            "type": "string"
        },
        "data": {
            "examples": [
                {
                    "email": "bob@test.com",
                    "password": "banana1234"
                }
            ],
            "allOf": [
                {
                    "anyOf": [
                        {
                            "type": "object",
                            "properties": {
                                "email": {
                                    "format": "email",
                                    "examples": [
                                        "bob@test.com"
                                    ],
                                    "type": "string"
                                }
                            },
                            "required": [
                                "email"
                            ]
                        },
                        {
                            "type": "object",
                            "properties": {
                                "username": {
                                    "minLength": 3,
                                    "maxLength": 20,
                                    "pattern": "^[A-Za-z0-9_-]+$",
                                    "examples": [
                                        "Bob"
                                    ],
                                    "type": "string"
                                }
                            },
                            "required": [
                                "username"
                            ]
                        }
                    ]
                },
                {
                    "type": "object",
                    "properties": {
                        "password": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "password"
                    ]
                }
            ]
        }
    },
    "required": [
        "command",
        "data"
    ]
}
```

</details>

#### TypeScript Definition
```ts
export interface UserGetTokenRequest {
    command: "user/getToken/request";
    data: (
        | {
              email: string;
          }
        | {
              username: string;
          }
    ) & {
        password: string;
    };
}

```
#### Example
```json
{
    "command": "user/getToken/request",
    "data": {
        "email": "bob@test.com",
        "password": "banana1234"
    }
}
```
### response

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/getToken/response",
    "anyOf": [
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/getToken/response",
                    "type": "string"
                },
                "status": {
                    "const": "success",
                    "type": "string"
                },
                "data": {
                    "examples": [
                        {
                            "token": "d2d5135930dacad758584b2586d03426"
                        }
                    ],
                    "type": "object",
                    "properties": {
                        "token": {
                            "type": "string"
                        }
                    },
                    "required": [
                        "token"
                    ]
                }
            },
            "required": [
                "command",
                "status",
                "data"
            ]
        },
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/getToken/response",
                    "type": "string"
                },
                "status": {
                    "const": "failed",
                    "type": "string"
                },
                "reason": {
                    "anyOf": [
                        {
                            "const": "no_user_found",
                            "type": "string"
                        },
                        {
                            "const": "invalid_password",
                            "type": "string"
                        },
                        {
                            "const": "max_attempts",
                            "type": "string"
                        },
                        {
                            "const": "internal_error",
                            "type": "string"
                        }
                    ]
                }
            },
            "required": [
                "command",
                "status",
                "reason"
            ]
        }
    ]
}
```

</details>

#### TypeScript Definition
```ts
export type UserGetTokenResponse =
    | {
          command: "user/getToken/response";
          status: "success";
          data: {
              token: string;
          };
      }
    | {
          command: "user/getToken/response";
          status: "failed";
          reason: "no_user_found" | "invalid_password" | "max_attempts" | "internal_error";
      };

```
#### Example
```json
{
    "command": "user/getToken/response",
    "status": "success",
    "data": {
        "token": "d2d5135930dacad758584b2586d03426"
    }
}
```
---

## login

Login using an authentication token from [getToken](#getToken).

### request

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/login/request",
    "type": "object",
    "properties": {
        "command": {
            "const": "user/login/request",
            "type": "string"
        },
        "data": {
            "examples": [
                {
                    "token": "d2d5135930dacad758584b2586d03426"
                }
            ],
            "type": "object",
            "properties": {
                "token": {
                    "type": "string"
                }
            },
            "required": [
                "token"
            ]
        }
    },
    "required": [
        "command",
        "data"
    ]
}
```

</details>

#### TypeScript Definition
```ts
export interface UserLoginRequest {
    command: "user/login/request";
    data: {
        token: string;
    };
}

```
#### Example
```json
{
    "command": "user/login/request",
    "data": {
        "token": "d2d5135930dacad758584b2586d03426"
    }
}
```
### response

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/login/response",
    "anyOf": [
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/login/response",
                    "type": "string"
                },
                "status": {
                    "const": "success",
                    "type": "string"
                },
                "data": {
                    "examples": [
                        {
                            "user": {
                                "battleStatus": null,
                                "userId": 123,
                                "email": "bob@test.com",
                                "username": "bob",
                                "isBot": false,
                                "clanId": null,
                                "friends": [
                                    12,
                                    34
                                ],
                                "friendRequests": [
                                    477
                                ],
                                "icons": {
                                    "rank": "silver-5"
                                },
                                "ignores": [],
                                "roles": [
                                    "mentor"
                                ]
                            }
                        }
                    ],
                    "type": "object",
                    "properties": {
                        "user": {
                            "type": "object",
                            "properties": {
                                "userId": {
                                    "type": "integer"
                                },
                                "username": {
                                    "type": "string"
                                },
                                "isBot": {
                                    "type": "boolean"
                                },
                                "clanId": {
                                    "anyOf": [
                                        {
                                            "type": "integer"
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "icons": {
                                    "type": "object",
                                    "patternProperties": {
                                        "^(.*)$": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "roles": {
                                    "examples": [
                                        [
                                            "admin",
                                            "moderator",
                                            "mentor"
                                        ]
                                    ],
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "battleStatus": {
                                    "anyOf": [
                                        {
                                            "type": "object",
                                            "properties": {
                                                "lobbyId": {
                                                    "anyOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "inGame": {
                                                    "type": "boolean"
                                                },
                                                "away": {
                                                    "type": "boolean"
                                                },
                                                "ready": {
                                                    "type": "boolean"
                                                },
                                                "playerNumber": {
                                                    "anyOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "teamColour": {
                                                    "anyOf": [
                                                        {
                                                            "type": "string"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "isPlayer": {
                                                    "type": "boolean"
                                                },
                                                "bonus": {
                                                    "type": "number"
                                                },
                                                "sync": {
                                                    "type": "object",
                                                    "properties": {
                                                        "engine": {
                                                            "type": "number"
                                                        },
                                                        "game": {
                                                            "type": "number"
                                                        },
                                                        "map": {
                                                            "type": "number"
                                                        }
                                                    },
                                                    "required": [
                                                        "engine",
                                                        "game",
                                                        "map"
                                                    ]
                                                },
                                                "partyId": {
                                                    "anyOf": [
                                                        {
                                                            "type": "integer"
                                                        },
                                                        {
                                                            "type": "null"
                                                        }
                                                    ]
                                                },
                                                "muted": {
                                                    "type": "boolean"
                                                }
                                            },
                                            "required": [
                                                "lobbyId",
                                                "inGame",
                                                "away",
                                                "ready",
                                                "playerNumber",
                                                "teamColour",
                                                "isPlayer",
                                                "bonus",
                                                "sync",
                                                "partyId",
                                                "muted"
                                            ]
                                        },
                                        {
                                            "type": "null"
                                        }
                                    ]
                                },
                                "email": {
                                    "format": "email",
                                    "type": "string"
                                },
                                "friends": {
                                    "type": "array",
                                    "items": {
                                        "type": "integer"
                                    }
                                },
                                "friendRequests": {
                                    "type": "array",
                                    "items": {
                                        "type": "integer"
                                    }
                                },
                                "ignores": {
                                    "type": "array",
                                    "items": {
                                        "type": "integer"
                                    }
                                }
                            },
                            "required": [
                                "userId",
                                "username",
                                "isBot",
                                "clanId",
                                "icons",
                                "roles",
                                "battleStatus",
                                "email",
                                "friends",
                                "friendRequests",
                                "ignores"
                            ]
                        }
                    },
                    "required": [
                        "user"
                    ]
                }
            },
            "required": [
                "command",
                "status",
                "data"
            ]
        },
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/login/response",
                    "type": "string"
                },
                "status": {
                    "const": "failed",
                    "type": "string"
                },
                "reason": {
                    "anyOf": [
                        {
                            "const": "invalid_token",
                            "type": "string"
                        },
                        {
                            "const": "expired_token",
                            "type": "string"
                        },
                        {
                            "const": "banned",
                            "type": "string"
                        },
                        {
                            "const": "internal_error",
                            "type": "string"
                        }
                    ]
                }
            },
            "required": [
                "command",
                "status",
                "reason"
            ]
        }
    ]
}
```

</details>

#### TypeScript Definition
```ts
export type UserLoginResponse =
    | {
          command: "user/login/response";
          status: "success";
          data: {
              user: {
                  userId: number;
                  username: string;
                  isBot: boolean;
                  clanId: number | null;
                  icons: {
                      [k: string]: string;
                  };
                  roles: string[];
                  battleStatus: {
                      lobbyId: number | null;
                      inGame: boolean;
                      away: boolean;
                      ready: boolean;
                      playerNumber: number | null;
                      teamColour: string | null;
                      isPlayer: boolean;
                      bonus: number;
                      sync: {
                          engine: number;
                          game: number;
                          map: number;
                      };
                      partyId: number | null;
                      muted: boolean;
                  } | null;
                  email: string;
                  friends: number[];
                  friendRequests: number[];
                  ignores: number[];
              };
          };
      }
    | {
          command: "user/login/response";
          status: "failed";
          reason: "invalid_token" | "expired_token" | "banned" | "internal_error";
      };

```
#### Example
```json
{
    "command": "user/login/response",
    "status": "success",
    "data": {
        "user": {
            "battleStatus": null,
            "userId": 123,
            "email": "bob@test.com",
            "username": "bob",
            "isBot": false,
            "clanId": null,
            "friends": [
                12,
                34
            ],
            "friendRequests": [
                477
            ],
            "icons": {
                "rank": "silver-5"
            },
            "ignores": [],
            "roles": [
                "mentor"
            ]
        }
    }
}
```
---

## recover

Should reset the password for the connected user and send it to the associated email address

### request

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/recover/request",
    "type": "object",
    "properties": {
        "command": {
            "const": "user/recover/request",
            "type": "string"
        }
    },
    "required": [
        "command"
    ]
}
```

</details>

#### TypeScript Definition
```ts
export interface UserRecoverRequest {
    command: "user/recover/request";
}

```
#### Example
```json
{
    "command": "user/recover/request"
}
```
### response

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/recover/response",
    "anyOf": [
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/recover/response",
                    "type": "string"
                },
                "status": {
                    "const": "success",
                    "type": "string"
                }
            },
            "required": [
                "command",
                "status"
            ]
        },
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/recover/response",
                    "type": "string"
                },
                "status": {
                    "const": "failed",
                    "type": "string"
                },
                "reason": {
                    "const": "internal_error",
                    "type": "string"
                }
            },
            "required": [
                "command",
                "status",
                "reason"
            ]
        }
    ]
}
```

</details>

#### TypeScript Definition
```ts
export type UserRecoverResponse =
    | {
          command: "user/recover/response";
          status: "success";
      }
    | {
          command: "user/recover/response";
          status: "failed";
          reason: "internal_error";
      };

```
#### Example
```json
{
    "command": "user/recover/response",
    "status": "success"
}
```
---

## rename

Change username for the current user.

### request

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/rename/request",
    "type": "object",
    "properties": {
        "command": {
            "const": "user/rename/request",
            "type": "string"
        },
        "data": {
            "type": "object",
            "properties": {
                "newUsername": {
                    "minLength": 3,
                    "maxLength": 20,
                    "pattern": "^[A-Za-z0-9_-]+$",
                    "examples": [
                        "Bob"
                    ],
                    "type": "string"
                }
            },
            "required": [
                "newUsername"
            ]
        }
    },
    "required": [
        "command",
        "data"
    ]
}
```

</details>

#### TypeScript Definition
```ts
export interface UserRenameRequest {
    command: "user/rename/request";
    data: {
        newUsername: string;
    };
}

```
#### Example
```json
{
    "command": "user/rename/request",
    "data": {
        "newUsername": "Bob"
    }
}
```
### response

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "user/rename/response",
    "anyOf": [
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/rename/response",
                    "type": "string"
                },
                "status": {
                    "const": "success",
                    "type": "string"
                }
            },
            "required": [
                "command",
                "status"
            ]
        },
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "user/rename/response",
                    "type": "string"
                },
                "status": {
                    "const": "failed",
                    "type": "string"
                },
                "reason": {
                    "anyOf": [
                        {
                            "const": "username_taken",
                            "type": "string"
                        },
                        {
                            "const": "username_profanity",
                            "type": "string"
                        },
                        {
                            "const": "internal_error",
                            "type": "string"
                        }
                    ]
                }
            },
            "required": [
                "command",
                "status",
                "reason"
            ]
        }
    ]
}
```

</details>

#### TypeScript Definition
```ts
export type UserRenameResponse =
    | {
          command: "user/rename/response";
          status: "success";
      }
    | {
          command: "user/rename/response";
          status: "failed";
          reason: "username_taken" | "username_profanity" | "internal_error";
      };

```
#### Example
```json
{
    "command": "user/rename/response",
    "status": "success"
}
```