const Booking = require('../models/Booking');
const Event = require('../models/Event');
const OTP = require('../models/OTP');
const { sendBookingEmail, sendOTPEmail } = require('../utils/email');

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();


// =====================================================
// SEND BOOKING OTP
// =====================================================

exports.sendBookingOTP = async (req, res) => {
    try {
        const otp = generateOTP();

        await OTP.findOneAndDelete({
            email: req.user.email,
            action: 'event_booking'
        });

        await OTP.create({
            email: req.user.email,
            otp,
            action: 'event_booking'
        });

        await sendOTPEmail(
            req.user.email,
            otp,
            'event_booking'
        );

        res.json({
            message: 'OTP sent successfully'
        });

    } catch (error) {
        console.error('Booking OTP Error:', error);

        res.status(500).json({
            message: 'Error sending OTP',
            error: error.message
        });
    }
};


// =====================================================
// BOOK EVENT
// =====================================================

exports.bookEvent = async (req, res) => {
    try {

        const { eventId, otp } = req.body;

        // ---------------------------------------------
        // 1. VERIFY OTP
        // ---------------------------------------------

        const validOTP = await OTP.findOne({
            email: req.user.email,
            otp,
            action: 'event_booking'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP for booking'
            });
        }


        // ---------------------------------------------
        // 2. FIND EVENT
        // ---------------------------------------------

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: 'Event not found'
            });
        }


        // ---------------------------------------------
        // 3. CHECK AVAILABLE SEATS
        // ---------------------------------------------

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                message: 'No seats available'
            });
        }


        // ---------------------------------------------
        // 4. CHECK EXISTING BOOKING
        // ---------------------------------------------

        const existingBooking = await Booking.findOne({
            userId: req.user.id,
            eventId
        });

        if (
            existingBooking &&
            existingBooking.status !== 'cancelled'
        ) {
            return res.status(400).json({
                message: 'Already booked or pending'
            });
        }


        // ---------------------------------------------
        // 5. CREATE BOOKING
        // ---------------------------------------------

        const booking = await Booking.create({
            userId: req.user.id,
            eventId,
            status: 'pending',
            paymentStatus: 'not_paid',
            amount: event.ticketPrice
        });


        // ---------------------------------------------
        // 6. RESERVE ONE SEAT
        // ---------------------------------------------

        event.availableSeats -= 1;

        await event.save();


        // ---------------------------------------------
        // 7. DELETE OTP
        // ---------------------------------------------

        await OTP.deleteOne({
            _id: validOTP._id
        });


        // ---------------------------------------------
        // 8. RESPONSE
        // ---------------------------------------------

        res.status(201).json({
            message: 'Booking created and seat reserved',
            booking,
            availableSeats: event.availableSeats
        });

    } catch (error) {

        console.error('Book Event Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


// =====================================================
// CONFIRM BOOKING AFTER PAYMENT
// =====================================================

exports.confirmBooking = async (req, res) => {
    try {

        const { paymentStatus } = req.body;

        const booking = await Booking.findById(req.params.id)
            .populate('userId')
            .populate('eventId');

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }


        // Already confirmed
        if (booking.status === 'confirmed') {
            return res.status(400).json({
                message: 'Booking is already confirmed'
            });
        }


        // Only successful payment can confirm booking
        if (paymentStatus !== 'paid') {

            return res.status(400).json({
                message: 'Payment is required to confirm booking'
            });
        }


        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';

        await booking.save();


        // Send confirmation email
        await sendBookingEmail(
            booking.userId.email,
            booking.userId.name,
            booking.eventId.title
        );


        res.json({
            message: 'Booking confirmed successfully',
            booking
        });

    } catch (error) {

        console.error('Confirm Booking Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


// =====================================================
// GET MY BOOKINGS
// =====================================================

exports.getMyBookings = async (req, res) => {
    try {

        const bookings = req.user.role === 'admin'

            ? await Booking.find()
                .populate('eventId')
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })

            : await Booking.find({
                userId: req.user.id
            })
                .populate('eventId')
                .sort({ createdAt: -1 });


        res.json(bookings);

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


// =====================================================
// CANCEL BOOKING
// =====================================================

exports.cancelBooking = async (req, res) => {
    try {

        const booking = await Booking.findById(
            req.params.id
        );

        if (!booking) {
            return res.status(404).json({
                message: 'Booking not found'
            });
        }


        // Authorization
        if (
            booking.userId.toString() !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                message: 'Not authorized'
            });
        }


        if (booking.status === 'cancelled') {
            return res.status(400).json({
                message: 'Already cancelled'
            });
        }


        // ---------------------------------------------
        // RELEASE RESERVED SEAT
        // ---------------------------------------------

        const event = await Event.findById(
            booking.eventId
        );

        if (event) {

            // Prevent availableSeats from exceeding totalSeats
            if (event.availableSeats < event.totalSeats) {

                event.availableSeats += 1;

                await event.save();
            }
        }


        // ---------------------------------------------
        // CANCEL BOOKING
        // ---------------------------------------------

        booking.status = 'cancelled';

        await booking.save();


        res.json({
            message: 'Booking cancelled and seat released'
        });

    } catch (error) {

        console.error('Cancel Booking Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};