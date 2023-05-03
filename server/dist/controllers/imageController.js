"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageData = exports.getSimilarImages = exports.updateImage = exports.deleteImage = exports.getImages = exports.getImage = exports.addImage = void 0;
const utils_1 = require("../utils/utils");
const dotenv = __importStar(require("dotenv")); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
const addImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    if (!files) {
        res.status(400).send("No files were uploaded.");
        return;
    }
    const uploadedImages = [];
    try {
        for (const file of files) {
            const base64Image = Buffer.from(file.buffer).toString("base64");
            const response = yield utils_1.weaviateClient.data
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
    }
    catch (error) {
        console.error("Error adding image to Weaviate:", error);
        res.status(500).send("Error uploading images");
    }
});
exports.addImage = addImage;
const getImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const imageId = req.params.id;
        // Fetch the image data from your database using the imageId
        const imageData = yield utils_1.weaviateClient.data
            .getterById()
            .withId(imageId)
            .withClassName("Image")
            .do();
        if (!((_a = imageData.properties) === null || _a === void 0 ? void 0 : _a.image)) {
            res.status(404).send("Image not found");
            return;
        }
        const binaryImage = Buffer.from((_b = imageData.properties) === null || _b === void 0 ? void 0 : _b.image, "base64");
        res.setHeader("Content-Type", "image/jpeg");
        res.send(binaryImage);
    }
    catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).send("Error fetching image");
    }
});
exports.getImage = getImage;
const getImageData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageId = req.params.id;
        // Fetch the image data from your database using the imageId
        const imageData = yield utils_1.weaviateClient.data
            .getterById()
            .withId(imageId)
            .withClassName("Image")
            // .withFields("text _additional { id } ")
            .do();
        console.log("imageData - ", imageData);
        if (!imageData) {
            res.status(404).send("Image not found");
            return;
        }
        res.send(imageData);
    }
    catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).send("Error fetching image");
    }
});
exports.getImageData = getImageData;
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const className = "Image";
        const limit = 1800; // Set your desired limit here
        const page = parseInt(req.params.page) || 1;
        const offset = (page - 1) * limit;
        // console.log("Page:", page);
        const response = yield utils_1.weaviateClient.graphql
            .get()
            .withClassName(className)
            .withLimit(limit)
            .withOffset(offset)
            .withFields("text _additional { id creationTimeUnix } ")
            .do();
        const countResponse = yield utils_1.weaviateClient.graphql
            .aggregate()
            .withClassName(className)
            .withFields("meta { count }")
            .do();
        let images = response.data.Get.Image;
        const count = countResponse.data.Aggregate.Image[0].meta.count;
        const totalPages = Math.ceil(count / limit);
        // Sort images by creationTimeUnix in descending order (most recent first)
        images = images.sort((a, b) => {
            return b._additional.creationTimeUnix - a._additional.creationTimeUnix;
        });
        res.json({ images, totalPages }); // Updated line
    }
    catch (error) {
        console.error("Error retrieving images from Weaviate:", error);
        res.status(500).send("Error retrieving images");
    }
});
exports.getImages = getImages;
const deleteImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageId = req.params.id;
        const imageExists = yield utils_1.weaviateClient.data
            .getterById()
            .withClassName("Image")
            .withId(imageId)
            .do();
        if (!imageExists) {
            res.status(404).send({ message: "Image not found" });
            return;
        }
        const response = yield utils_1.weaviateClient.data
            .deleter()
            .withId(imageId)
            .withClassName("Image")
            .do();
        console.log("Weaviate delete response:", response);
        res.status(200).send({ message: "Image deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting image from Weaviate:", error);
        res.status(500).send("Error deleting image");
    }
});
exports.deleteImage = deleteImage;
const updateImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { text } = req.body;
    const className = "Image";
    try {
        // Get the image by ID
        const imageResponse = yield utils_1.weaviateClient.data
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
            yield utils_1.weaviateClient.data
                .updater()
                .withId(id)
                .withClassName(className)
                .withProperties({ text: text, image: updatedVector }) // Include the updated vector here
                .do();
            res.status(200).send({ message: "Image updated successfully" });
        }
    }
    catch (error) {
        console.error("Error updating image:", error);
        res.status(500).send({ message: "Error updating image", error });
    }
});
exports.updateImage = updateImage;
const getSimilarImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        const imageId = req.params.id;
        const image = yield utils_1.weaviateClient.data
            .getterById()
            .withId(imageId)
            .withClassName("Image")
            .do();
        if (!((_c = image.properties) === null || _c === void 0 ? void 0 : _c.image)) {
            res.status(404).send("Image not found");
            return;
        }
        const b64 = image.properties.image;
        //Get similar images with and return text image and id
        let similarImagesLimit = 5;
        if (process.env.SIMILAR_IMAGES_LIMIT) {
            similarImagesLimit = parseInt(process.env.SIMILAR_IMAGES_LIMIT);
        }
        const result = yield utils_1.weaviateClient.graphql
            .get()
            .withClassName("Image")
            .withFields("text _additional { id }")
            .withNearImage({ image: b64 })
            .withLimit(similarImagesLimit)
            .do();
        // console.log("Result:", JSON.stringify(result, null, 2));
        const images = result.data.Get.Image;
        res.status(200).json({ images });
    }
    catch (error) {
        console.log(error);
        // console.error("Error retrieving similar images from Weaviate:", error);
        // res.status(500).json({ message: "Error retrieving similar images" });
    }
});
exports.getSimilarImages = getSimilarImages;
