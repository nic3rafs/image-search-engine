"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/images", upload.array("images"), imageController_1.addImage);
router.get("/imageUrl/:id", imageController_1.getImage);
router.get("/images/:id", imageController_1.getImageData);
router.get("/images/", imageController_1.getImages);
router.delete("/images/:id", imageController_1.deleteImage);
router.put("/images/:id", imageController_1.updateImage);
router.get("/images/similar/:id", imageController_1.getSimilarImages);
exports.default = router;
