const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subject'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Topic', TopicSchema);