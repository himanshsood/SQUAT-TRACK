const express = require("express");
const fs = require("fs");
const path = require("path");
const Post = require("../models/Post"); // Assuming you have a Post model
const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    // Fetch the post from the database using its ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Generate a text file with the post content
    const fileContent = `Title: ${post.title}\n\nContent:\n${post.desc}`;
    const fileName = `${post.title.replace(/\s+/g, "_")}.txt`;

    // Send the file as a response for download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "text/plain");
    res.send(fileContent);
  } catch (error) {
    console.error("Error generating post file:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
