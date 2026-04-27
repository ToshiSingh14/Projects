const Post = require("./models/Post");
const express = require('express');
const cors = require('cors');
const path = require("path");
const postsRoutes = require("./routes/postsRoutes");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/post", postsRoutes);


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/signin", (req, res) => {
    res.render("signin");
});

app.get("/dashboard", async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "username")
            .sort({ createdAt: -1 });

        res.render("dashboard", { posts });

    } catch (error) {
        res.send("Error loading dashboard");
    }
});

app.get("/create", (req, res) => {
    res.render("createPost");
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/signin");
});

module.exports = app;
