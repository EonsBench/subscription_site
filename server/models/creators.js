const mongoose = require('mongoose');

const CreatorSchema = new mongoose.Schema({
    user_id: {type:mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    bio: {type: String},
    profile_image:{type: String}
});

const Creator = mongoose.model('Creator', CreatorSchema);
module.exports = Creator;