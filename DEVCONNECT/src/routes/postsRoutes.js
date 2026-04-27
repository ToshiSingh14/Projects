const express = require("express");

const router = express.Router();

const postController = require("../controllers/postController");

const auth = require("../middlewares/auth");

// AUTH ROUTES
router.post("/signup", postController.signup);

router.post("/signin", postController.signin);


router.get("/me", auth, postController.me);

// BLOG ROUTES
router.get("/", auth, postController.sendPosts); // Get all posts

router.post("/create", auth, postController.createPost); // Create post

router.get("/:id", auth, postController.getSinglePost); // Get single post

router.put("/:id", auth, postController.updatePost); // Update own post

router.delete("/:id", auth, postController.deletePost); // Delete own post

module.exports = router;