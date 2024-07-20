const { get } = require('../routes/tourRoutes');

const getAllUsers = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const getUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const createUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const updateUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};
const deleteUser = (req, res) => {
  res.status(500).json({ status: 'fail', message: 'this route is under dev!' });
};

module.exports = { updateUser, createUser, getAllUsers, getUser, deleteUser };
