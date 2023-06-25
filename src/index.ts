import { Type } from "@sinclair/typebox";
import fs from "fs";
import { objectKeys } from "jaz-ts-utils";
import { compile } from "json-schema-to-typescript";
import path from "path";

import { Endpoint } from "@/helpers";

(async () => {
    let fullSchema: any = {};
    const serviceDirs = path.join(__dirname, "schema");
    const serviceHandlerDirs = await fs.promises.readdir(serviceDirs);
    for (const serviceId of serviceHandlerDirs) {
        if (serviceId.includes(".")) {
            continue;
        }
        const endpointDir = path.join(serviceDirs, serviceId);
        const endpointSchemaModules = await fs.promises.readdir(endpointDir, {
            withFileTypes: false,
        });
        const serviceSchema: any = {};
        for (const endpointSchemaPath of endpointSchemaModules) {
            const endpointId = path.parse(endpointSchemaPath).name;
            const endpoint = await import(path.join(endpointDir, endpointSchemaPath));
            const endpointSchema = endpoint.default as Endpoint;
            await fs.promises.mkdir(path.join("dist", serviceId, endpointId), { recursive: true });
            const endpointSchema2: any = {};
            if ("request" in endpointSchema) {
                const schema = Type.Strict(
                    Type.Object({
                        command: Type.Literal(`${serviceId}/${endpointId}/request`),
                        data: endpointSchema.request,
                    })
                );
                const schemaStr = JSON.stringify(schema, null, 4);
                await fs.promises.writeFile(`dist/${serviceId}/${endpointId}/request.json`, schemaStr);
                endpointSchema2.request = schema;
            }
            if ("response" in endpointSchema) {
                if (endpointSchema.response.anyOf) {
                    for (const obj of endpointSchema.response.anyOf) {
                        obj.properties.command.const = `${serviceId}/${endpointId}/response`;
                    }
                } else {
                    endpointSchema.response.properties.command.const = `${serviceId}/${endpointId}/response`;
                }
                const schema = Type.Strict(endpointSchema.response);
                const schemaStr = JSON.stringify(schema, null, 4);
                await fs.promises.writeFile(`dist/${serviceId}/${endpointId}/response.json`, schemaStr);
                endpointSchema2.response = schema;
            }
            serviceSchema[endpointId] = Type.Object(endpointSchema2);
        }
        fullSchema[serviceId] = Type.Object(serviceSchema);
    }

    fullSchema = Type.Strict(Type.Object(fullSchema));
    let typings = await compile(Type.Strict(fullSchema), "Tachyon", {
        additionalProperties: false,
        bannerComment: `/**
        * This file was automatically generated, do not edit it manually.
        * Instead modify the .ts files in src/schema and do npm run build
        */`,
        style: {
            bracketSpacing: true,
            tabWidth: 4,
            semi: true,
        },
    });
    const types = await import("./schema/types");
    for (const key of objectKeys(types)) {
        const thing = types[key];
        const type = await compile(Type.Strict(thing as any), key, {
            bannerComment: "",
            additionalProperties: false,
            style: {
                bracketSpacing: true,
                tabWidth: 4,
                semi: true,
            },
        });
        typings += type + "\n";
    }

    typings += `
export type ServiceId = keyof Tachyon;

export type EndpointId = keyof Tachyon[ServiceId];

export type RequestEndpointId<S extends ServiceId> = keyof {
    [key in keyof Tachyon[S] as Tachyon[S][key] extends { request: any } ? key : never]: Tachyon[S][key];
};

export type ResponseEndpointId<S extends ServiceId> = keyof {
    [key in keyof Tachyon[S] as Tachyon[S][key] extends { response: any } ? key : never]: Tachyon[S][key];
};

export type RequestType<S extends ServiceId, E extends RequestEndpointId<S>> = Tachyon[S][E] extends { request: infer Req } ? Req : object;

export type ResponseType<S extends ServiceId, E extends ResponseEndpointId<S>> = Tachyon[S][E] extends { response: infer Res } ? Res : object;

export type RequestData<S extends ServiceId, E extends RequestEndpointId<S>> = Tachyon[S][E] extends { request: { data: infer Data } } ? Data : never;

export type ResponseData<S extends ServiceId, E extends ResponseEndpointId<S>> = Tachyon[S][E] extends { response: { data: infer Data } } ? Data : never;

export type RemoveField<T, K extends string> = T extends { [P in K]: any } ? Omit<T, K> : never;

export type GetCommands<S extends ServiceId, E extends keyof Tachyon[S]> = Tachyon[S][E];
`;
    await fs.promises.writeFile(`dist/index.d.ts`, typings);
})();
