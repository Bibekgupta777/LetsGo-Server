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

// Create Payment Intent
const createPaymentIntent = async (req, res) => {
    try {
        const { booking_id, amount } = req.body;
        const user_id = req.user.id;

        // Verify booking exists and belongs to user
        const booking = await Booking.findOne({ 
            _id: booking_id,
            user_id: user_id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or unauthorized"
            });
        }

        // Check if payment already exists
        const existingPayment = await Payment.findOne({ 
            booking_id,
            status: { $in: ['succeeded', 'pending'] }
        });

        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment already exists for this booking"
            });
        }

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                booking_id: booking_id.toString(),
                user_id: user_id.toString()
            }
        });

        // Create payment record with payment_intent_id
        await Payment.create({
            booking_id,
            user_id,
            amount,
            payment_intent_id: paymentIntent.id, // Use Stripe's payment_intent_id
            status: 'pending',
            currency: 'usd'
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error("Payment Intent Creation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Confirm Payment
const confirmPayment = async (req, res) => {
    try {
        const { payment_intent_id } = req.body;

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status === 'succeeded') {
            // Update payment record
            const payment = await Payment.findOneAndUpdate(
                { payment_intent_id },
                {
                    status: 'succeeded',
                },
                { new: true }
            );

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: "Payment record not found"
                });
            }

            // Update booking status
            await Booking.findByIdAndUpdate(payment.booking_id, {
                payment_status: "completed",
                booking_status: "confirmed"
            });

            // Create notification
            await Notification.create({
                user_id: payment.user_id,
                type: "payment_confirmation",
                message: `Payment of ${payment.amount} USD received for booking ${payment.booking_id}`,
                reference_id: payment.booking_id,
                reference_type: "booking"
            });

            return res.status(200).json({
                success: true,
                message: "Payment confirmed successfully",
                payment
            });
        } else {
            return res.status(400).json({
                success: false,
                message: `Payment status: ${paymentIntent.status}`
            });
        }

    } catch (error) {
        console.error("Payment Confirmation Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};