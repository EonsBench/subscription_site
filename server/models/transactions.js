const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    amount: {type: Number, required: true},
    transaction_date: {type: Date, default: Date.now},
    transaction_type: {type: String, enum:['donation', 'refund'], required: true},
    status: {type: String, enum:['success', 'failed'], required: true}
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;