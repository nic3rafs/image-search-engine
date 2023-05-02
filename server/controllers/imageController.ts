import { Request, Response } from "express";
import { weaviateClient } from "../utils/utils";
import { text } from "stream/consumers";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

type GetImageResponse = {
  class?: string;
  creationTimeUnix?: number;
  id?: string;
  lastUpdateTimeUnix?: number;
  properties?: {
    image?: string;
    text?: string;
  };
};

const addImage = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files) {
    res.status(400).send("No files were uploaded.");
    return;
  }

  const uploadedImages = [];

  try {
    for (const file of files) {
      const base64Image = Buffer.from(file.buffer).toString("base64");
      const response = await weaviateClient.data
        .creator()
        .withClassName("Image")
        .withProperties({
          image: base64Image,
          text: file.originalname.split(".")[0],
        })
        .do();

      uploadedImages.push({
        _additional: {
          id: response.id,
        },
        text: file.originalname.split(".")[0],
        image: base64Image,
      });
    }

    res.status(200).send("Images uploaded successfully");
  } catch (error) {
    console.error("Error adding image to Weaviate:", error);
    res.status(500).send("Error uploading images");
  }
};

const getImage = async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id;
    // Fetch the image data from your database using the imageId
    const imageData: GetImageResponse = await weaviateClient.data
      .getterById()
      .withId(imageId)
      .withClassName("Image")
      .do();

    if (!imageData.properties?.image) {
      res.status(404).send("Image not found");
      return;
    }
    const binaryImage = Buffer.from(imageData.properties?.image, "base64");
    res.setHeader("Content-Type", "image/jpeg");
    res.send(binaryImage);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
};
const getImageData = async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id;
    // Fetch the image data from your database using the imageId
    const imageData: GetImageResponse = await weaviateClient.data
      .getterById()
      .withId(imageId)
      .withClassName("Image")
      // .withFields("text _additional { id } ")
      .do();

    if (!imageData) {
      res.status(404).send("Image not found");
      return;
    }
    res.send(imageData);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).send("Error fetching image");
  }
};

const getImages = async (req: Request, res: Response) => {
  try {
    const className = "Image";
    const limit = 1800; // Set your desired limit here
    const page = parseInt(req.params.page) || 1;
    const offset = (page - 1) * limit;

    // console.log("Page:", page);
    const response = await weaviateClient.graphql
      .get()
      .withClassName(className)
      .withLimit(limit)
      .withOffset(offset)
      .withFields("text _additional { id creationTimeUnix } ")
      .do();

    const countResponse = await weaviateClient.graphql
      .aggregate()
      .withClassName(className)
      .withFields("meta { count }")
      .do();

    let images = response.data.Get.Image;
    const count = countResponse.data.Aggregate.Image[0].meta.count;
    const totalPages = Math.ceil(count / limit);

    // Sort images by creationTimeUnix in descending order (most recent first)
    images = images.sort((a: any, b: any) => {
      return b._additional.creationTimeUnix - a._additional.creationTimeUnix;
    });

    res.json({ images, totalPages }); // Updated line
  } catch (error) {
    console.error("Error retrieving images from Weaviate:", error);
    res.status(500).send("Error retrieving images");
  }
};
const deleteImage = async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id;

    const imageExists = await weaviateClient.data
      .getterById()
      .withClassName("Image")
      .withId(imageId)
      .do();

    if (!imageExists) {
      res.status(404).send({ message: "Image not found" });
      return;
    }

    const response = await weaviateClient.data
      .deleter()
      .withId(imageId)
      .withClassName("Image")
      .do();
    
    console.log("Weaviate delete response:", response);

    res.status(200).send({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image from Weaviate:", error);
    res.status(500).send("Error deleting image");
  }
};


const updateImage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const className = "Image";

  try {
    // Get the image by ID
    const imageResponse = await weaviateClient.data
      .getterById()
      .withClassName(className)
      .withId(id)
      .do();

    // console.log("Image response:", imageResponse);

    // Update the schema with the new name and image
    if (imageResponse.properties) {
      const existingVector = imageResponse.properties["image"]; // Fetch the existing vector
      const updatedVector = existingVector;
      // Update the object in Weaviate
      await weaviateClient.data
        .updater()
        .withId(id)
        .withClassName(className)
        .withProperties({ text: text, image: updatedVector }) // Include the updated vector here
        .do();

      res.status(200).send({ message: "Image updated successfully" });
    }
  } catch (error) {
    console.error("Error updating image:", error);
    res.status(500).send({ message: "Error updating image", error });
  }
};

const getSimilarImages = async (req: Request, res: Response) => {
  try {
    const imageId = req.params.id;
    const image = await weaviateClient.data
      .getterById()
      .withId(imageId)
      .withClassName("Image")
      .do();

    if (!image.properties?.image) {
      res.status(404).send("Image not found");
      return;
    }
    const b64 = image.properties.image as string;
    //Get similar images with and return text image and id
    let similarImagesLimit = 5;
    if (process.env.SIMILAR_IMAGES_LIMIT) {
      similarImagesLimit = parseInt(process.env.SIMILAR_IMAGES_LIMIT);
    }
    const result = await weaviateClient.graphql
      .get()
      .withClassName("Image")
      .withFields("text _additional { id }")
      .withNearImage({ image: b64 })
      .withLimit(similarImagesLimit)
      .do();

    // console.log("Result:", JSON.stringify(result, null, 2));
    const images = result.data.Get.Image;
    res.status(200).json({ images });
  } catch (error) {
    console.log(error);
    // console.error("Error retrieving similar images from Weaviate:", error);
    // res.status(500).json({ message: "Error retrieving similar images" });
  }
};

export {
  addImage,
  getImage,
  getImages,
  deleteImage,
  updateImage,
  getSimilarImages,
  getImageData,
};
