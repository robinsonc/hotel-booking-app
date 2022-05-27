import express from 'express'
import Mongoose from 'mongoose'
import ReservationModel, { validateReservation } from '../model/reservation'

const router = express.Router()

// Create a new reservation
router.post('/reservation', async (req, res) => {
    // validate using Joi, with factoring function
    const { error } = validateReservation(req.body)

    const check_in = new Date(req.body.check_in);
    const check_out = new Date(req.body.check_out);

    // To calculate the time difference of two dates
    var difference_in_time = check_out.getTime() - check_in.getTime();

    // To calculate the no. of days between two dates
    var difference_in_days = difference_in_time / (1000 * 3600 * 24);
    
    if(difference_in_days > 3) {
        return res.status(422).json({
            success: false,
            data: [],
            message: 'Sorry!! You can not reserve presidential suite for more than 3 days.',
        })
    } else {
        // Check for overlapping reservation
       const booking = await ReservationModel.find({check_out: {$gte: check_in}, check_in :{$lte: check_out}});
        // checking if booking not found then 404 request
        if(booking.length > 0){
            return res.status(422).json({
                success: false,
                data: [],
                message: 'Sorry!! Reservation is not available for given dates.',
            })
        }
    }

  
    // if have any error then return bad request with error else just add the new one
    if (error) {
      return res.status(400).json({
        success: false,
        data: [],
        message: error.details[0].message,
      })
    }
  
    let booking = new ReservationModel({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        no_of_guests: req.body.no_of_guests,
        check_in: req.body.check_in,
        check_out: req.body.check_out
    })
  
    booking = await booking.save();
  
    return res.status(200).json({
      success: true,
      booking_id: booking._id,
      message: 'Booking  Successful!' ,
      retrieve_info:'To retieve the reservation call GET http://<base_url>/api/v1/reservation/<booking_id>',
      cancel_info: 'To Cancel booking, call DELETE http://<base_url>/api/v1/reservation/<booking_id>'
    })
})


// Get request for getting all bookings
router.get('/reservation', async (_req, res) => {
    // sending all data to response
    const bookings = await ReservationModel.find();

    return res.json({
        success: true,
        data: bookings,
        message: 'Request successful!',
    })
});

// Get the data about a single reservation
router.get('/reservation/:id', async (req, res) => {
    if (!Mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).json({
        success: false,
        data: [],
        message: 'Sorry, we could not find the reservation with this booking id!!',
    })

    // search using id In mongodb with mongoose
    const booking = await ReservationModel.findById(req.params.id)

    // checking if booking not found then 404 request
    if (!booking)
        return res.status(404).json(
        res.json({
            success: false,
            data: [],
            message: 'There is no reservation found related to this booking id!',
        })
        )
    // if found then send the response
    return res.json({
        success: true,
        data: booking,
        message: 'Finding successful!',
    })
});

// Cancel a reservation
router.delete('/reservation/:id', async (req, res) => {
    // find an delete the data using moongoose & mongodb
    const booking = await ReservationModel.findByIdAndRemove(req.params.id)
  
    // checking if booking not found then 404 request & if found then send the response
    if (!booking)
      return res.status(404).json({
        success: false,
        data: [],
        message: 'There is no reservation found related to this booking id!',
      })
  
    // finally response send with cancelled data
    return res.json({
      success: true,
      data: booking,
      message: 'Cancellation successful!',
    })
})



export default router