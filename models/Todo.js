const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    completed: {
        type: Boolean
    },
    title: {
        type: String
    }
});

module.exports = mongoose.model('Todo', Todo);