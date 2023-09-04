const express = require("express");

// controller imports
const {
  register,
  login,
  updateUser,
  deleteUser,
  logout,
  verifyEmail,
} = require("../controllers/users.controller");

//middleware imports
const { authenticateUser } = require("../middleware/userAuth");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);

//middle to protect authenticated routes
router.use(authenticateUser);
router.use("*", (req, res, next) => {
  /* #swagger.security = [{
          "bearerAuth": []
  }] */
  next();
});

router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
