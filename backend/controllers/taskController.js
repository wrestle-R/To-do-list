const Task = require('../models/task');

// Add a new task
exports.addTask = async (req, res) => {
    try {
        const { userId, title } = req.body;
        if (!userId || !title) return res.status(400).json({ error: "User ID and title are required." });

        const newTask = new Task({ userId, title });
        await newTask.save();
        res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete a task
// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const { taskId, userId } = req.params;

        // Check if the task exists and belongs to the user
        const task = await Task.findOne({ _id: taskId, userId });
        if (!task) {
            return res.status(404).json({ error: "Task not found or unauthorized" });
        }

        // Delete the task
        await task.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

