const express = require('express');
const { addTask, getTasks, deleteTask } = require('../controllers/taskController');
const router = express.Router();

router.post('/task', addTask);
router.get('/tasks/:userId', getTasks);
router.delete('/task/:taskId/:userId', deleteTask);

module.exports = router;
