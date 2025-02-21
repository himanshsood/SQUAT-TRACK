

const router = require("express").Router();
const Post = require("../models/Post");

// CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update fields
      { new: true } // Return the updated document
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json("Post not found.");
    res.status(200).json("Post has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST BY ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL POSTS (with search, user, and category filtering)
router.get("/", async (req, res) => {
  try {
    const { search, user, cat } = req.query;
    let posts;

    if (search) {
      // Search by title or content
      const regex = new RegExp(search, "i"); // Case-insensitive
      posts = await Post.find({
        $or: [{ title: regex }, { content: regex }],
      });
    } else if (user) {
      // Filter by user
      posts = await Post.find({ username: user });
    } else if (cat) {
      // Filter by category
      posts = await Post.find({ categories: { $in: [cat] } });
    } else {
      // Return all posts
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
