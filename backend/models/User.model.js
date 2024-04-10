const moment = require('moment');
const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'username is required']
  },
  number: {
    type: String,
    // required: [true, 'number is required']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email address.',
    ],
    // required: [true, 'Please enter Email Address'],
    lowercase: true,
    //immutable: true
  },
  password: {
    type: String,
    minLength: 6,
  },
  cart: {
    type: [cartItemSchema],
    default: [],
  },
  createdAt: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    immutable: true,
  },
  updatedAt: {
    type: String,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
