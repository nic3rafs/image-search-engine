import { Router } from "express";
import {
  addImage,
  getImage,
  getImages,
  deleteImage,
  updateImage,
  getSimilarImages,
  getImageData,
} from "../controllers/imageController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post("/images", upload.array("images"), addImage);
router.get("/imageUrl/:id", getImage);
router.get("/images/:id", getImageData);
router.get("/images/", getImages);
router.delete("/images/:id", deleteImage);
router.put("/images/:id", updateImage);
router.get("/images/similar/:id", getSimilarImages);

export default router;