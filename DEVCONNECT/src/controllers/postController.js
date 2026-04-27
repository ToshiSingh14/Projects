const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Post = require("../models/Post");

const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP 
const signup = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).send({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            password: hashedPassword
        });

        res.status(201).send({
            message: "Signup successful"
        });

    } catch (error) {
        res.status(500).send({
            message: "Server error"
        });
    }
};

//SIGNIN
const signin = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(403).send({
                message: "Invalid username or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(403).send({
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username
            },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

       res.cookie("token", token);
       res.redirect("/dashboard");

    } catch (error) {
        res.status(500).send({
            message: "Server error"
        });
    }
};

// CURRENT USER
const me = async (req, res) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).send({
                message: "Token required"
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            });
        }

        res.send(user);

    } catch (error) {
        res.status(401).send({
            message: "Unauthorized"
        });
    }
};

// CREATE POST
const createPost = async (req, res) => {
    const { title, content } = req.body;

    const post = await Post.create({
        title,
        content,
        author: req.user.userId
    });

    res.redirect("/dashboard");
};

// GET ALL POSTS
const sendPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("author", "username");

        res.send(posts);

    } catch (error) {
        res.status(500).send({
            message: "Server error"
        });
    }
};




// UPDATE OWN POST

const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.send("Post not found");
        }

        // owner only
        if (post.author.toString() !== req.user.userId) {
            return res.status(403).send("Unauthorized");
        }

        post.title = req.body.title;
        post.content = req.body.content;

        await post.save();

        res.redirect("/dashboard");

    } catch (error) {
        console.log(error);
        res.send({ message: "Server error" });
    }
};

// DELETE OWN POST
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send("Post not found");
        }

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).send("Only owner can delete");
        }

        await Post.findByIdAndDelete(req.params.id);

        res.redirect("/dashboard");

    } catch (error) {
        res.status(500).send("Server Error");
    }
};

// DASHBOARD PAGE
const dashboard = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "username");

        res.render("dashboard", {
            posts,
            userId: req.user.userId
        });

    } catch (error) {
        res.status(500).send("Server Error");
    }
};

// Get Single Post
const getSinglePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "username");

        if (!post) return res.send("Post not found");

        res.render("singlePost", { post });

    } catch (error) {
        res.send("Error loading post");
    }
};

// Show Edit Form
const editPostPage = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.send("Post not found");

        if (post.author.toString() !== req.user.userId) {
            return res.status(403).send("Unauthorized");
        }

        res.render("editPost", { post });

    } catch (error) {
        res.send("Error loading edit page");
    }
};



module.exports = {
     signup,
    signin,
    me,
    dashboard,
    createPost,
    sendPosts,
    getSinglePost,
    updatePost,
    deletePost,
    editPostPage,
    getSinglePost
};