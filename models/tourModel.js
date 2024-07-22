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
