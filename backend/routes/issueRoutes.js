const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  updateStatus,
  getStats
} = require("../controllers/issueController");

router.route("/")
.post(protect, createIssue)
.get(protect, getIssues);

router.get("/stats", protect, getStats);

router.patch("/:id/status", protect, updateStatus);

router.route("/:id")
.get(protect, getIssueById)
.put(protect, updateIssue)
.delete(protect, deleteIssue);

module.exports = router;