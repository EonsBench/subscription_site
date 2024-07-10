const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    title:{type:String, required: true},
    description: {type: String, required: true},
    mediaUrl:{type: String, required: true},
    creator:{type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    date:{type:Date, default: Date.now}
});

module.exports = mongoose.model('Content', ContentSchema);