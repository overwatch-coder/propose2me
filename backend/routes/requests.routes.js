const express = require("express");
const router = express.Router();

//controller imports
const {
  getAllUserRequests,
  getSingleRequest,
  createRequest,
  updateRequest,
  deleteRequest,
  adminGetsAllRequests,
} = require("../controllers/requests.controller");

//middleware imports
const { authenticateUser } = require("../middleware/userAuth");

//get all requests regardless of the user
router.post("/all", adminGetsAllRequests);

//middle to protect authenticated routes
router.use(authenticateUser);
router.use("*", (req, res, next) => {
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
  next();
});

router.get("/", getAllUserRequests);
router.get("/:id", getSingleRequest);
router.post("/", createRequest);
router.patch("/:id", updateRequest);
router.delete("/:id", deleteRequest);

module.exports = router;
