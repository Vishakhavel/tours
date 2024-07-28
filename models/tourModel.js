const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    // the required boolean, followed by error message when this is not met.
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
  },
  ratingAverage: {
    type: Number,
    // required: [true, ]
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  //   you can declare type like this if you dont need any other restriction, instead of putting inside an object
  priceDiscount: Number,
  summary: {
    type: String,
    // will trim the string. check mongoose docs
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    // file name to fetch it later from a file service.
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  // array declared like this
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    // hide this from all the queries mongoose, and never show this to the client
    select: false,
  },
  startDates: [Date],
});

// convention to use Caps first letter with model name
// first arg is the name of the model, then the schema with which you wanna create a new model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;

// creating a document from a model. just like creating a new object out of a class.
// const testTour = new Tour({
//   name: 'THE PARK CAMPER',
//   rating: 4.7,
//   price: 1234,
// });
