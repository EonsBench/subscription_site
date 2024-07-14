const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, default:Date.now},
    updateAt: {type:Date, default:Date.now}
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;