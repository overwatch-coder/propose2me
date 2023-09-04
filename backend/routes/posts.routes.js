const express = require("express");
const router = express.Router();

//controller imports
const {
  getAllUserPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  adminGetsAllPosts,
} = require("../controllers/posts.controller");

//middleware imports
const { authenticateUser } = require("../middleware/userAuth");

//get all posts regardless of the user
router.post("/all", adminGetsAllPosts);

//middle to protect authenticated routes
router.use(authenticateUser);
router.use("*", (req, res, next) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  next();
});

router.get("/", getAllUserPosts);
router.get("/:id", getSinglePost);
router.post("/", createPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);

module.exports = router;
