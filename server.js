// install this dependency, and let it know where the env variable config file is located, this will update the process env file for node
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
// run the code in the app file only after the config file is read.
const app = require('./app');

// replace the password text in the connection string with the actual DB password
const DB = process.env.DATABASE_CONNECTION_STRING.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// connect returns a promise
mongoose
  .connect(DB, {
    // just some options to deal with deprecation warnings. use this everytime.
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((con) => {
    // console.log({ connection: con.connection });
    console.log('DB connection successful!');
  });

const port = process.env.port || 3000;

// default ah it's development
// console.log(app.get('env'));
// console.log(process.env);
app.listen(port, () => {
  console.log('app running on port', port);
});
