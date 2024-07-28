const Tour = require('./../models/tourModel');

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price ratingAverage';
  req.query.fields = 'name,price,summary,ratingAverage,summary,difficulty';
  next();
};
const getAllTours = async (req, res) => {
  try {
    // find will return an array of all the documents.
    // and will also convert them into js objects.

    // exclude special params, like page, which well send for pagination.
    // nope, arrays and objects are passed by reference!
    // const queryObj = req.query;

    // 1. filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.map((curField) => delete queryObj[curField]);

    console.log('query params', req.query);
    console.log('query params modified', queryObj);

    // BUILD THE QUERY. note no await here, since we're only building the query

    // manual filter object for a query where rating >=5 and difficulty = easy
    // {difficulty: 'easy', rating: {$gte: 5} }

    // this is what the api would look like - http://localhost:3000/api/v1/tours?duration[gte]=5&difficulty=easy&sort=1&limit=10&page=1

    // express converts this into - query params modified { duration: { gte: '5' }, difficulty: 'easy' }
    // 2. advanced filtering

    // replace gte, gt, lte, le.
    let queryString = JSON.stringify(queryObj);
    // regex to replace
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    console.log('parsed operator query', JSON.parse(queryString));

    // find returns a query, so we can chain on this
    let query = Tour.find(JSON.parse(queryString));

    // sorting

    if (req.query.sort) {
      // ..&sort='price' will be there in the URL
      //   will sort first based on the first param, second on the second param, if tied
      const sortBy = req.query.sort.split(',').join(' ');
      console.log({ sortBy });
      //   an arrat
      //   query = query.sort(req.query.sortBy);
      //   to get descending order, pass - like : ....?sort=-price,ratingAverage => sorts descending order of price and ascending order of ratingAverage
      query = query.sort(sortBy);
      //   mongoose will automatically sort by price!
      //   TODO: find out how to sort using mongoose if the field is nested inside some other object?
    } else {
      // if user does not send any sort query param, sort by latest anyways
      query = query.sort('-createdAt');
    }

    // field limiting

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      console.log({ fields });
      query = query.select(fields);
    } else {
      // removing internal field __v included by mongoDB
      query.select('-__v');
    }

    // pagination
    // ?page=2&limit=10
    // convert string to number for page
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;

    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('Page does not exist');
      }
    }

    // special mongoose methods.
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    // EXECUTE THE QUERY. THIS IS SO THAT WE CAN BUILD THE QUERY STEP BY STEP, PAGINATION, FILTERING, RATE LIMITING ETC.
    const tours = await query;

    console.log({ length: tours.length });

    res.status(200).json({
      status: 'success',
      // good practice to send the length of the result, when the result is an array.
      result: tours.length,
      //   envelope the response inside an object
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save()
  // you can directly create a document in the collection from the model.

  //   you can use the promise returned from the create, or use async await.
  // Tour.create({}).then()

  // try catch to handle errors in async await instead of .then, .catch in promises
  try {
    const newTour = await Tour.create(req.body);
    console.log({ newTour });
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log('Error occured in createTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

const getTour = async (req, res) => {
  try {
    // findById -> finds document by ID passed in the param
    // same as Tour.findOne({_id: req.params.id})
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log('Error occured in getTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

const updateTour = async (req, res) => {
  // this is a patch request, not put.
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // new updated document will be the one that will be returned. if new = false, the method will return the original document before the update was applied!

      //   check mogoose docs for these 2 options
      new: true,
      runValidators: true,
    });

    await tour.save();
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    console.log('Error occured in updateTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res
      .status(204)
      .json({ status: 'success', message: 'deleted tour successfully' });
  } catch (err) {
    console.log('Error occured in deleteTour', err);
    res.status(400).json({
      status: 'fail ',
      message: 'invalid data sent!',
    });
  }
};

module.exports = {
  deleteTour,
  createTour,
  getTour,
  getAllTours,
  updateTour,
  aliasTopTours,
};
