const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
{
  title: { type: String, required: true },

  description: { type: String, required: true },

  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Low"
  },

  status: {
    type: String,
    enum: ["Open", "In Progress", "Resolved", "Closed"],
    default: "Open"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);