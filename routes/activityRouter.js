const router = require("express").Router();
// const { verifyToken, authorization } = require("../middleware/verifyToken");

const {
  createActivity,
  updateActivity,
  deleteActivity,
  getAllActivities,
  searchActivity,
} = require("../controller/activityController");
router.post("/", createActivity);
router.put("/:id", updateActivity);

router.delete("/:id", deleteActivity);

router.get("/getAllActivities", getAllActivities);

router.get("/searchActivity", searchActivity);

module.exports = router;

//http://localhost:3000/api/activity/getAllActivities?events=Mint