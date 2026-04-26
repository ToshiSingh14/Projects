const express = require("express");

const router = express.Router();

const postController = require("../controllers/postController");

// AUTH ROUTES
router.post("/signup", postController.signup);

router.post("/signin", postController.signin);

router.get("/me", postController.me);

// BLOG ROUTES
router.get("/", postController.sendPosts); // Get all posts

router.post("/create", postController.createPost); // Create post

router.get("/:id", postController.getSinglePost); // Get single post

router.put("/:id", postController.updatePost); // Update own post

router.delete("/:id", postController.deletePost); // Delete own post

module.exports = router;