const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Tour = require('../../models/tourModel');
dotenv.config({ path: './config.env' });

// replace the password text in the connection string with the actual DB password
const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// connect returns a promise
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((con) => {
    console.log('populating dev data DB connection');
  });

//   read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded into DB');
    // lil aggressive way of stopping an app
    process.exit();
  } catch (err) {
    console.log('Error inside importData', err);
  }
};

// delete all the data from the collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted from DB');
    // lil aggressive way of stopping an app
    process.exit();
  } catch (err) {
    console.log('Error inside deleteData', err);
  }
};

// EASTER EGG!
// this argv is an array of strings where we can run a function selectively inside a file based on the input from the command line.

// run node dev-data/data/importDevData.js --import  ,

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  // run node dev-data/data/importDevData.js --delete
  deleteData();
}
console.log(process.argv);
