const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    subscription_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true},
    amount: {type: Number, required: true},
    donation_date: {type: Date, default: Date.now}
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;