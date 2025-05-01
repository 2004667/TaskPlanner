const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create new task
router.post('/', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        });
        console.log(task);
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all tasks
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user._id });
        res.send(tasks);
    } catch (error) {
        res.status(500).send();
    }
});

// Update task
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'dueDate', 'priority', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        console.log(req.params.id);
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => {
            task[update] = req.body[update];
        });
        await task.save();
        console.log(task);
        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});


// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router; 