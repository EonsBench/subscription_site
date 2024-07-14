const mongoose = require('mongoose');

const TierSchema = new mongoose.Schema({
    creator_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    amount: {type: Number, required: true},
});

const Tier = mongoose.model('Tier', TierSchema);
module.exports = Tier;