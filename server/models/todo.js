var mongoose = require('mongoose');

const todoSchema = {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
};
var Todo = mongoose.model('Todo', todoSchema);

module.exports = {
    Todo
};