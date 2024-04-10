const express = require('express');
const { getUserList } = require('../controllers/User.controller');
const router = express.Router();

const UserController = require('../controllers/User.controller');

//get users frome careline
router.get('/careline-add-user', UserController.getCareLineUsers);
router.get('/careline-update-user', UserController.updateCareLineUsers);
router.post('/careline-search-user', UserController.getCarelineUser);
//Get a list of all users
router.post('/list', UserController.getAllUsers);
router.get('/', UserController.getUserList);

//Create a new user
router.post('/',UserController.createNewUser);

//Get an user by id
router.get('/:id', UserController.findUserById);

//Update a user by id
router.patch('/:id', UserController.updateAUser);

//Delete a user by id
router.delete('/:id', UserController.deleteAUser);


module.exports = router;