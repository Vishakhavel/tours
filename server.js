// install this dependency, and let it know where the env variable config file is located, this will update the process env file for node
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// run the code in the app file only after the config file is read.

const app = require('./app');
const port = process.env.port || 3000;

// default ah it's development
// console.log(app.get('env'));
// console.log(process.env);
app.listen(port, () => {
  console.log('app running on port', port);
});
