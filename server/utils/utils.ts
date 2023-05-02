import fs from "fs";
import weaviate, { WeaviateClient } from "weaviate-ts-client";

const toBase64 = (file: string) => {
  // read binary data
  let bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString("base64");
};

const weaviateClient = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',  // Replace with your endpoint

});

export { toBase64, weaviateClient };
