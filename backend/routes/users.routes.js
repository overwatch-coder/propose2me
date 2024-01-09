const express = require("express");

// controller imports
const {
  register,
  login,
  updateUser,
  deleteUser,
  logout,
  verifyEmail,
  getSpecificUserDetails,
  updateProfilePicture,
  sendCustomEmailVerificationLink,
  sendForgotPasswordLink,
  updateAccountPassword,
} = require("../controllers/users.controller");

//middleware imports
const { authenticateUser } = require("../middleware/userAuth");

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", sendForgotPasswordLink);
router.patch("/reset-password", updateAccountPassword);

//middle to protect authenticated routes
router.use(authenticateUser);
router.use("*", (req, res, next) => {
  /* #swagger.security = [{
          "bearerAuth": []
  }] */
  next();
});

router.get("/users/user", getSpecificUserDetails);
router.post("/users/verify-email", sendCustomEmailVerificationLink);
router.patch("/profile", updateProfilePicture);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
