const mongoose = require('mongoose');
const sendEmail = require("../middleware/sendEmail");

const User = require('../models/User.model');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError } = require('../errors/custom-error');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
// const Roles = require('../Models/Roles.model');


module.exports = {

  googleloginUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    let googleEmail;
    console.log(req.body)
    const gtoken = req.body.token;
    console.log(req.body.token)
    const ticket = await client.verifyIdToken({
      idToken: gtoken,
      audience: process.env.CLIENT_ID,
    });
    console.log("ticket======", ticket)
    const payload = ticket.getPayload();
    console.log("payload", payload.email)
    googleEmail = payload.email
    

    const user = await User.findOne({ email: googleEmail, is_deleted: false });
    console.log("user", user)
    if (!user) {
      errorArray.push("Email Id is not valid")
      next(createCustomError(errorArray, 404, false))
      return;
    }

    if (user.panelLoginstatus === false) {
      errorArray.push("You dont have Panel Access")
      next(createCustomError(errorArray, 404, false, 'no'))
      return;
    }

    // const role = await Roles.findOne({ is_deleted: false, _id: user.roleId }, { permissions: 1, roleName: 1 })

    // var token = jwt.sign({ id: user._id, email: user.email, name: user.username, permissions: role.permissions ,roleId:user.roleId}, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_LIFETIME // expires in 30 days
    // });

    var token = jwt.sign({ id: user._id, email: user.email, name: user.username,}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME // expires in 30 days
    });

    res.send({ 'status': true, 'token': token, 'user': user });

  }),


  loginUser: asyncWrapper(async (req, res, next) => {

    let errorArray = [];
    console.log('req.body',req.body)
    const email = req.body.email;

    /*if (email !== 'superadmin@girnarcare.com' && email !== 'ramawtar.saini@girnarsoft.com' && email !== 'jatin.kumar1@girnarcare.com') {
      errorArray.push("You don't have Manual Login Access");
      next(createCustomError(errorArray, 404, false, 'yes'))
      return;
    }*/


    const user = await User.findOne({ email: email, is_deleted: false });
    if (!user) {
      errorArray.push("Email Id is not valid")
      next(createCustomError(errorArray, 404, false, 'yes'))
      return;
    }
    //console.log('user',user);
    if (!user.password) {
      errorArray.push("You can not login with password");
      next(createCustomError(errorArray, 404, false, 'yes'))
      return;
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      errorArray.push("Password is not correct")
      next(createCustomError(errorArray, 404, false, 'yes'))
      return;
    }
    if (user.panelLoginstatus === false) {
      errorArray.push("You dont have Panel Access")
      next(createCustomError(errorArray, 404, false, 'no'))
      return;
    }
    const role = await Roles.findOne({ is_deleted: false, _id: user.roleId }, { permissions: 1, roleName: 1 })

    if (role) {
      console.log(role)

      var token = jwt.sign({ id: user._id, email: user.email, name: user.username, permissions: role.permissions, roleId: user.roleId, roleName: role.roleName, userType: user.userType }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME // expires in 30 days
      });
      console.log(token)



      res.send({ 'status': true, 'token': token, 'user': user });

    }

    else {

      return res.status(404).send({message: 'Invalid credentials'});
    }

  }),





  forgotPassword: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      errorArray.push("Email is not valid!!")
      next(createCustomError(errorArray, 404, false));
      return;
    }

    const secret = process.env.JWT_SECRET
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "15m",
    });
    const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

    await sendEmail(user.email, "Password reset", link);

    res.status(200).send({ message: "password reset link sent to your email account" });

    console.log(link);

  }),

  getResetPassword: asyncWrapper(async (req, res, next) => {
    
    let errorArray = [];
    const { id, token } = req.params;
    const user = await User.findOne({ _id: id });
    if (!user) {
      errorArray.push("Invalid User Id");
      next(createCustomError(errorArray, 404, false));
      return;

    }
    if (!token)
      return res.status(401).send('Access Denied !');
    console.log(process.env.JWT_SECRET);
    console.log(token);
    const secret = process.env.JWT_SECRET

    const verify = jwt.verify(token, secret, process.env.JWT_LIFETIME);
    console.log("inside verify", verify)
    if (!verify) {
      return res.status(403).send("Not Verified Token");
    }

  }),

  postResetPassword: asyncWrapper(async (req, res, next) => {
    
    let errorArray = [];
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) });
    if (!user) {
      errorArray.push("Invalid User Id");
      next(createCustomError(errorArray, 404, false));
      return;
    }
    if (!token) {

      return res.status(401).send('Access Denied !');
    }
    const secret = process.env.JWT_SECRET

    jwt.verify(token, secret, process.env.JWT_LIFETIME, function (err, resp) {
      if (err) {
        errorArray.push("Invalid Token");

      }
    });
    if (errorArray.length) {
      next(createCustomError(errorArray, 403, false));
      return;
    }
    else {

      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: mongoose.Types.ObjectId(id),
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
      res.json({ status: "Password updated" });
    }
  })
}
