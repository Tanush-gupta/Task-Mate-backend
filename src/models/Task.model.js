import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "TO DO",
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Task", taskSchema);
