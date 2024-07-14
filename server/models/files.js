const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    post_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    file_path: {type: String, required: true},
    uploadAt: {type: Date, default: Date.now}
});

const File = mongoose.model('File', FileSchema);
module.exports = File;