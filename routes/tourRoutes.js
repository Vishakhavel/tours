const express = require('express');
const router = express.Router();

const {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTours,
} = require('../controllers/tourController');

// param middleware gets access to a 4th argument which is the value of the paramter in question. we can directly access the value of the param sent in the URL!!
// router.param('id', (req, res, next, val) => {
//   console.log('tour id is', val);
//   console.log('inside tour params');
//   next();
// });

// replace with a function to check if the id is valid for a tour
// this is really useful, we can validate params seperately without validating the ID inside each function seperately
// router.param('id', checkID);
// chaining middleware checkTourBody before actually creating the tour.

// random comment

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
