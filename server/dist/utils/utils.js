"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.weaviateClient = exports.toBase64 = void 0;
const fs_1 = __importDefault(require("fs"));
const weaviate_ts_client_1 = __importDefault(require("weaviate-ts-client"));
const toBase64 = (file) => {
    let bitmap = fs_1.default.readFileSync(file);
    return Buffer.from(bitmap).toString("base64");
};
exports.toBase64 = toBase64;
const weaviateClient = weaviate_ts_client_1.default.client({
    scheme: 'http',
    host: 'localhost:8080', // Replace with your endpoint
});
exports.weaviateClient = weaviateClient;
