const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

// Get Stripe public key
const getStripePublicKey = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
