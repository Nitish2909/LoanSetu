const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    loanType: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    dob: { type: Date, required: true },
    amount: { type: Number, required: true, min: 10000 },
    income: { type: Number, required: true, min: 5000 },
    city: { type: String, required: true, trim: true },
    notes: { type: String, default: '', trim: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });
customerSchema.index({ name: 'text', email: 'text' });
const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;