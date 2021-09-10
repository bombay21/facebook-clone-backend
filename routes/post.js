const Post = require("../models/Post");
const User = require("../models/User");
const router = require("express").Router();

// create new post
router.post("/create", async (req, res) => {
  try{
    const newPost = new Post(req.body);
    // save new post and return the saved data
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  }catch(err){
    return res.status(500).json(err)
  }
});

// update post
router.put("/:id", async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (post.userId == req.body.userId) {
            try {
                await post.updateOne({ $set: req.body});
                res.status(200).json(req.params.id + " has been updated");
            } catch (err) {
                return res.status(500).json(err);
            }
        } else {
        return res.status(400).json("action not permitted");
        }
    }catch(err){
        res.status(500).json(err)
    }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
        const post = await Post.findById(req.params.id)
        if (req.body.userId === post.userId || req.body.isAdmin) {
        try {
            await post.deleteOne();
            res.status(200).json(req.params.id+" has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
        } else {
        return res.status(403).json("You can delete only your post");
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

// get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    !post && res.status(404).json("post not found");
    const { updatedAt, ...others } = post._doc;
    res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// like a post
router.put("/:id/likeOrDislike", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
        !post && res.status(404).json("post not found")
      if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json("post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        return res.status(200).json("post has been unliked");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
});

// fetch all posts
router.get("/timeline/:id", async (req, res) => {
    try {
        const currUser = await User.findById(req.params.id);
        const currUserPosts = await Post.find({userId: req.params.id});
        
        const followingsPosts = await Promise.all(
            currUser.following.map((id) => {
                return Post.find({userId: id})
            })
        )
        return res.status(200).json(currUserPosts.concat(...followingsPosts))
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
