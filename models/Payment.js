// models/Payment.js
const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
    booking_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: [true, "Booking ID is required"]
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"]
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    payment_intent_id: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ["pending", "succeeded", "failed", "refunded", "cancelled"],
        default: "pending"
    },
    currency: {
        type: String,
        default: "usd"
    }
}, { 
    timestamps: true,
    // Explicitly specify which indexes to create
    indexes: [
        { payment_intent_id: 1 }
    ]
});

// Remove all indexes before creating new ones
paymentSchema.pre('save', async function(next) {
    try {
        await this.collection.dropIndexes();
    } catch (error) {
        console.log('Error dropping indexes:', error);
    }
    next();
});

const Payment = mongoose.model("Payment", paymentSchema);

// Ensure indexes
Payment.createIndexes().catch(console.error);

module.exports = Payment;