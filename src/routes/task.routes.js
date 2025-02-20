import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../controller/Task.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.post("/addTask", createTask);
router.get("/getTasks", getTasks);

router.patch("/:taskId/updateStatus", updateTaskStatus);
router.delete("/:taskId/delete", deleteTask);

export default router;
