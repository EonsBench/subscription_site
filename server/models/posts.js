const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    creator:{type: mongoose.Schema.ObjectId, ref: 'Creator', required: true},
    title:{type:String, required: true},
    content: {type: String, required: true},
    createAt:{type:Date, default: Date.now},
    updateAt:{type:Date, default: Date.now}
});

const Post = mongoose.model('Post', ContentSchema);
module.exports = Post;