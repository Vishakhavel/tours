const express = require('express');
const fs = require('fs');

const app = express();

// express.json() is middleware for express
app.use(express.json());
// app.get('/', (req, res) => {
//   console.log('inside health check');

//   //   res.status(200).send('hey there!');
//   res.status(404).json({ responseFromServer: 'vanakkam da mapla' });
// });

// app.post('/', (req, res) => {
//   console.log('post call logged');
//   res.status(200).json({ data: 'post call return data' });
// });

// read the data from the file - since the top level of the file is read only once.

// convert json to js object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// api versioning.
app.get('/api/v1/tours', (req, res) => {
  // this function is called the route handler.
  res.status(200).json({
    status: 'success',
    // good practice to send the length of the result, when the result is an array.
    result: tours.length,
    //   envelope the response inside an object
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // req body is only available cos we used express.json() middleware. commenting this middleware out will give undefined for the bloew log.
  console.log('req body from post call', req.body);
  const newId = tours[tours.length - 1].id + 1;
  //   combine 2 objects
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  //   inside the callback, we should never use sync code and block the event loop!
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) res.send(400);
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

// id2 is optional

// app.get('/api/v1/tours/:id/:id2?', (req, res) => {
app.get('/api/v1/tours/:id', (req, res) => {
  //   console.log('params', req.params);

  const id = Number(req.params.id);

  if (id > tours.length)
    res
      .status(404)
      .json({ status: 'failed', message: 'tour not found with ID' });
  const tour = tours.find((tour) => tour.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log('app running on port', port);
});
