import User from "../models/User.model.js";
import Task from "../models/Task.model.js";
import { taskValidationSchema } from "./validator.js";

export const getTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("tasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ tasks: user.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Server error while fetching tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { error } = taskValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const userId = req.user._id;
    const { title, description, status, dueDate } = req.body;
    const newTask = new Task({ title, description, status, dueDate });
    await newTask.save();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.tasks.push(newTask._id);
    await user.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error.message);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const user = req.user;

    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (!user.tasks.some((id) => id.toString() === taskId)) {
      return res
        .status(401)
        .json({ message: "Unauthorized to delete this task" });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: { tasks: taskId },
    });

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const user = req.user;
    if (!taskId) {
      return res.status(400).json({ message: "Task ID is required" });
    }

    const validStatuses = ["TO DO", "IN PROGRESS", "COMPLETED"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (user.tasks.indexOf(taskId) === -1) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this task" });
    }

    task.status = status;
    await task.save();
    return res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    console.error("Error updating task status:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to update task status", error: error.message });
  }
};
