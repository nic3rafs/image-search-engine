import { weaviateClient } from "../utils/utils";

const schemaConfig = {
  class: "Image",
  vectorizer: "img2vec-neural",
  vectorIndexType: "hnsw",
  moduleConfig: {
    "img2vec-neural": {
      imageFields: ["image"],
    },
  },
  properties: [
    {
      name: "image",
      dataType: ["blob"],
    },
    {
      name: "name",
      dataType: ["string"],
    },
  ],
};

const main = async () => {
  await weaviateClient.schema.classCreator().withClass(schemaConfig).do();
};
main();
