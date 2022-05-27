import Mongoose from 'mongoose'
import Joi from 'joi'

const reservationSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  no_of_guests: {
    type: Number,
    required: true
  },
  check_in: {
    type: Date,
    required: true
  },
  check_out: {
    type: Date,
    required: true
  }
}, {
    timestamps: true
});

// Create model by mongoose
const ReservationModel = Mongoose.model('Reservation', reservationSchema);

// Initialing the shema for validation parameters
const JoiSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2}).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    no_of_guests: Joi.number().integer().min(1).max(3).required(),
    check_in: Joi.date().iso().min("now").required(),
    check_out: Joi.date().iso().min(Joi.ref('check_in')).required()
});

// validation using Joi & finally return the result of validation
export const validateReservation = (reservation) => JoiSchema.validate(reservation)

export default ReservationModel