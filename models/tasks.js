const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    notes: {body: String},
    assignedTo: { type: String },
    completed: Boolean
});

const List = mongoose.model('List', listSchema);

module.exports = List;
