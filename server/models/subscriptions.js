const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    tier_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Tier', required: true},
    start_date: {type: Date, default: Date.now},
    end_date: {type: Date, default: Date.now},
    next_pay_date: {type: Date, default: Date.now},
    status: {type: String, enum: ['active', 'paused', 'cancelled'], default: active}
});

const Subscription = mongoose.model('Subscription', SubscriptionSchema);
module.exports = Subscription;