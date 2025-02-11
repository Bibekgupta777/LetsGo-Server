const Seat = require("../models/Seat");
const Booking = require("../models/Booking");

const getSeatsBySchedule = async (req, res) => {
  try {
    const { schedule_id } = req.params;

    // Find all bookings for this schedule
    const bookings = await Booking.find({ 
      schedule_id,
      booking_status: { $nin: ['cancelled'] } // Exclude cancelled bookings
    });

    // Get all booked seat numbers from the bookings
    const bookedSeats = bookings.reduce((seats, booking) => {
      return [...seats, ...booking.seats.map(seat => seat.seat_number)];
    }, []);

    // Get total seats available from schedule
    const totalSeats = 40; // Or fetch from your schedule/bus configuration

    // Create array of all seats with availability
    const seatLayout = [];
    const rows = "ABCDEFGHIJ".split("");
    const cols = [1, 2, 3, 4];
    
    rows.forEach(row => {
      cols.forEach(col => {
        const seatNumber = `${row}${col}`;
        seatLayout.push({
          seat_number: seatNumber,
          is_available: !bookedSeats.includes(seatNumber)
        });
      });
    });

    res.status(200).json({
      success: true,
      data: {
        seats: seatLayout,
        total_seats: totalSeats,
        available_seats: totalSeats - bookedSeats.length,
        booked_seats: bookedSeats
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching seats", 
      error: error.message 
    });
  }
};

module.exports = {
  getSeatsBySchedule
};