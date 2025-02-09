const Subject = require('../models/subject');
const Topic = require('../models/topic');

// Get all subjects for a user
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ userId: req.params.userId });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subjects' });
    }
};

// Create new subject
exports.createSubject = async (req, res) => {
    try {
        const { subject, userId } = req.body;
        const newSubject = new Subject({
            name: subject,
            userId
        });
        await newSubject.save();
        res.json({ message: 'Subject added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating subject' });
    }
};

// Delete subject and its topics
exports.deleteSubject = async (req, res) => {
    try {
        await Topic.deleteMany({ subjectId: req.params.subjectId });
        await Subject.findByIdAndDelete(req.params.subjectId);
        res.json({ message: 'Subject and associated topics deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting subject' });
    }
};

// Get topics for a subject
exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({ 
            userId: req.params.userId,
            subjectId: req.params.subjectId
        });
        res.json(topics);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching topics' });
    }
};

// Create new topic
exports.createTopic = async (req, res) => {
    try {
        const { topic, subjectId, userId, dueDate } = req.body;
        const newTopic = new Topic({
            title: topic,
            subjectId,
            userId,
            dueDate,
            completed: false
        });
        await newTopic.save();
        res.json({ message: 'Topic added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error creating topic' });
    }
};

// Update topic completion status
exports.updateTopicCompletion = async (req, res) => {
    try {
        const { completed } = req.body;
        await Topic.findByIdAndUpdate(req.params.topicId, { completed });
        res.json({ message: 'Topic updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating topic' });
    }
};

// Delete topic
exports.deleteTopic = async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.topicId);
        res.json({ message: 'Topic deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting topic' });
    }
};
