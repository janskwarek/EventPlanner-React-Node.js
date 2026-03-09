import express from "express";
import {
  getFavorites,
  getFavoriteIds,
  addFavorite,
  removeFavorite,
} from "../controllers/favoritesController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/favorites", verifyToken, getFavorites);
router.get("/favorites/ids", verifyToken, getFavoriteIds);
router.post("/favorites/:id", verifyToken, addFavorite);
router.delete("/favorites/:id", verifyToken, removeFavorite);

export default router;
