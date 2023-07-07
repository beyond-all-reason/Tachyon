# system

- [version](#version)
---

## version

Sends the current version of the protocol to new Websocket clients as soon as they connect.

### response

<details>
<summary>JSONSchema</summary>

```json
{
    "$id": "system/version/response",
    "anyOf": [
        {
            "type": "object",
            "properties": {
                "command": {
                    "const": "system/version/response",
                    "type": "string"
                },
                "status": {
                    "const": "success",
                    "type": "string"
                },
                "data": {
                    "type": "object",
                    "properties": {
                        "tachyonVersion": {
                            "const": "0.1.0",
                            "type": "string"
                        }
                    },
                    "required": [
                        "tachyonVersion"
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
                    "const": "system/version/response",
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
export type SystemVersionResponse =
    | {
          command: "system/version/response";
          status: "success";
          data: {
              tachyonVersion: "0.1.0";
          };
      }
    | {
          command: "system/version/response";
          status: "failed";
          reason: "internal_error";
      };

```
#### Example
```json
{
    "command": "system/version/response",
    "status": "success",
    "data": {
        "tachyonVersion": "0.1.0"
    }
}
```