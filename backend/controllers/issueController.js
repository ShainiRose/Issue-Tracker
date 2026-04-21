const Issue = require("../models/Issue");

const createIssue = async (req, res) => {
  const issue = await Issue.create({
    ...req.body,
    createdBy: req.user
  });

  res.status(201).json(issue);
};

const getIssues = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  let query = {};

  if (req.query.search) {
    query.title = {
      $regex: req.query.search,
      $options: "i"
    };
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.priority) {
    query.priority = req.query.priority;
  }

  if (req.query.severity) {
    query.severity = req.query.severity;
  }

  const total = await Issue.countDocuments(query);

  const issues = await Issue.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    total,
    page,
    pages: Math.ceil(total / limit),
    issues
  });
};

const getIssueById = async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  res.json(issue);
};

const updateIssue = async (req, res) => {
  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(issue);
};

const deleteIssue = async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ message: "Issue deleted" });
};

const updateStatus = async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return res.status(404).json({ message: "Issue not found" });
  }

  issue.status = req.body.status;
  await issue.save();

  res.json(issue);
};

const getStats = async (req, res) => {
  const open = await Issue.countDocuments({ status: "Open" });
  const progress = await Issue.countDocuments({ status: "In Progress" });
  const resolved = await Issue.countDocuments({ status: "Resolved" });
  const closed = await Issue.countDocuments({ status: "Closed" });

  res.json({
    Open: open,
    InProgress: progress,
    Resolved: resolved,
    Closed: closed
  });
};

module.exports = {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  updateStatus,
  getStats
};