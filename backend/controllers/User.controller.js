const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
const User = require('../models/User.model');
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError } = require('../errors/custom-error');
const request = require('request');

const Constants = require('../Constants');
// const Roles = require('../models/Roles.model');


module.exports = {
  getAllUsers: asyncWrapper(async (req, res, next) => {
    const { length, page, userType, entity, search, panelStatus, searchEmail } = req.body;
    let errorArray = [];
    let users;
    let totalCount;
    let query = { is_deleted: false, email: { $ne: "superadmin@girnarcare.com" } };

    if (!length) {
      errorArray.push("length is required");
    } else if (length <= 0) {
      errorArray.push("Length should be greater than zero");
    }

    if (!page) {
      errorArray.push("page is required");
    } else if (page <= 0) {
      errorArray.push("Page should be greater than zero");
    }

    if (errorArray.length > 0) {
      return next(createCustomError(errorArray, 404, false, 'no'));
    }

    if (userType) {

      query.userType = userType

    }
    if (entity) {

      query.entity = entity

    }
    if (panelStatus) {

      query.panelLoginstatus = panelStatus

    }
    if (search) {
      if (/^-?\d+$/.test(search)) {
        console.log('search is number.....');
        const regexNum = '(.*' + search + '.*)';
        query['empId'] = { $regex: new RegExp(regexNum) };
      } else {

        let regexString = '(.*' + search + '.*)';
        query['$or'] = [
          { 'username': new RegExp(regexString, 'i') },
          { 'email': new RegExp(regexString, 'i') }
        ];
      }
    }

    if (searchEmail) {

      // let regexString = '^' + searchEmail;
      // query['$or'] = [
      //   { 'email': new RegExp(regexString, 'i') }
      // ];
      users = await User.find(query);

    }
    else {

      totalCount = await User.find(query).count(query);
      users = await User.find(query).sort({ _id: 1 }).limit(length).skip((page - 1) * length);
    }


    // if (users.length == 0) {
    //   errorArray.push('No User Found')
    //   next(createCustomError(errorArray, 404, false));
    //   return

    // }
    const result = {
      records: users,
      totalCount: totalCount

    }

    res.status(200).send({ message: 'users Fetched Successfully', result });

  }),
  getCarelineUser: asyncWrapper(async (req, res, next) => {
    let finalUserObj;
    const { empId, name, searchBy, searchValue } = req.body;
    // let userSearch= empId || name;
    let errorArray = [];
    const matchQuery = {
      is_deleted: false
    };

    // if (searchKey) {
    //   matchQuery.username = { $regex: name, $options: 'i' };
    // } else if (empId) {
    //   matchQuery.empId = empId;
    // }
    if (searchValue && searchBy) {
      matchQuery[searchBy] = { $regex: searchValue, $options: 'i' };
    }
    const facetQuery = [
      {
        $facet: {
          "users": [
            { $match: matchQuery }
          ]
        }
      }
    ];

    const resp = await User.aggregate(facetQuery)
    console.log("inseide respppp", resp)
    const users = resp[0].users
    console.log("users", users)

    if (users.length > 0) {
      if (searchBy === "name") {
        errorArray.push("User With Given Name already exists");
      }
      else if (searchBy === "empId") {

        errorArray.push("User With Given Emp ID already exists");
      }
    }


    if (req.body.password === undefined) {
      req.body.password = '123456';
    }
    req.body.password = bcrypt.hashSync(req.body.password, 8);

    if (errorArray.length > 0) {

      return next(createCustomError(errorArray, 404, false, 'yes'))
    }

    else {
      const filterData = { "status": "A" };
      let carelineUser;
      carelineUser = await getdata(filterData, searchValue, searchBy);
      console.log(carelineUser)
      if (carelineUser.length > 0) {
        const finalUserObjList = [];

        for (let i = 0; i < carelineUser.length; i++) {
          const { employee_id, name, phone_number, email, entity, gender, date_of_birth, address, band, department, desination, password } = carelineUser[i];

          let obj = {
            'empId': employee_id,
            'username': name,
            'userType': "Executive",
            'number': phone_number || "Not Given",
            'email': email,
            'password': password,
            'entity': entity,
            'gender': gender,
            'date_of_birth': date_of_birth,
            'address': address,
            'band': band,
            'department': department,
            'desination': desination,
            'updatedAt': moment().format('MMMM Do YYYY, h:mm:ss a')
          }

          const finalUserObj = await assignRoleId(department, obj);
          finalUserObjList.push(finalUserObj);
        }

        const result = {
          records: finalUserObjList,
        }

        res.status(200).send({ message: 'Users Fetched Successfully', result });
      }

      else {

        errorArray.push('No Record Found!!!')
        next(createCustomError(errorArray, 404, false, 'yes'));
        return;

      }

    }


  }),

  createNewUser: asyncWrapper(async (req, res, next) => {

    const { empId } = req.body;
    const errorArray = [];

    const users = await User.aggregate([
      {
        $facet: {
          empId: [
            { $match: { empId: empId.toString(), is_deleted: false } },
          ],
        },
      },
    ]);

    if (users[0].empId.length > 0) {
      errorArray.push("User already exists");
    }

    if (errorArray.length > 0) {
      return next(createCustomError(errorArray, 404, false, "no"));
    }

    const user = new User(req.body);
    user.createdAt = moment().format("MMMM Do YYYY, h:mm:ss a");
    const result = await user.save();

    res.status(200).send({ message: "User Created Successfully", status: true, result });

  }),


  findUserById: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    const filter = { is_deleted: false, _id: mongoose.Types.ObjectId(req.params.id) }

    const user = await User.aggregate([
      {
        $match: filter
      },
      {
        $lookup: {
          from: 'roles',
          localField: 'roleId',
          foreignField: '_id',
          as: "userInfo"
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          "_id": 0,
          "empId": 1,
          "username": 1,
          "number": 1,
          "email": 1,
          "entity": 1,
          "gender": 1,
          "band": 1,
          "department": 1,
          "desination": 1,
          "date_of_birth": 1,
          "userInfo.roleName": 1,
          "userInfo.permissions": 1,

        }
      }
    ]);

    if (!user) {
      errorArray.push('No User found with this id')
      next(createCustomError(errorArray, 404, false, 'no'));
      return;
    }

    res.status(200).send({ message: "result", user });

  }),

  updateAUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    console.log('update:req.body', req.body);

    const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
    const updates = req.body;
    updates.updatedAt = moment().format('DD-MM-YYYY HH:mm:SS')

    console.log(req.body)
    const result = await User.findByIdAndUpdate(filter, updates, { new: true });

    if (!result) {
      errorArray.push('No User found for update with this id')
      next(createCustomError(errorArray, 404, false, 'no'));
      return;
    }

    res.status(200).send({ message: "User Updated Successfully", result });

  }),

  deleteAUser: asyncWrapper(async (req, res, next) => {
    let errorArray = [];
    const filter = { _id: mongoose.Types.ObjectId(req.params.id) };
    const update = { is_deleted: true };
    update.updatedAt = moment().format('DD-MM-YYYY HH:mm:SS')


    const result = await User.findByIdAndUpdate(filter, update, { new: true });

    if (!result) {
      errorArray.push('Can not delete user with id')
      next(createCustomError(errorArray, 404, false, 'no'));
      return;
    }

    res.send({ message: "User Deleted successfully", result });
    console.log('update:req.body', req.body);
  }),

  getUserList: asyncWrapper(async (req, res, next) => {
    let errorArray = [];


    let query = { is_deleted: false }


    const result = await User.find(query);

    if (result.length == 0) {
      errorArray.push('No User Found')
      next(createCustomError(errorArray, 404, false, 'no'));
      return

    }

    res.status(200).send({ message: 'Users Fetched Successfully', result });

  }),


  getCareLineUsers: asyncWrapper(async (req, res, next) => {

    let total_user = 0;
    const filterData = { "status": "A" };

    const allusers = await getdata(filterData);
    total_user = allusers.length;
    console.log('total_user', total_user);

    const updateObj = await goUpdate(allusers);
    console.log('updateObj', updateObj);

    console.log('send response');
    res.status(200).send({
      "total_user": total_user,
      "add_user": updateObj.add_user,
      "add_user_validation_error": updateObj.add_user_validation_error,
      "update_user": updateObj.update_user,
      "update_user_validation_error": updateObj.update_user_validation_error
    });
  }),

  updateCareLineUsers: asyncWrapper(async (req, res, next) => {
    console.log('call update careline user function');
    let total_user = 0;
    let d = new Date();

    const filterData = { "status": "A", "last_updated_date": moment(d).format('YYYYMMDD') };

    const allusers = await getdata(filterData);
    total_user = allusers.length;
    console.log('total_user', total_user);

    const updateObj = await goUpdate(allusers);
    console.log('updateObj', updateObj);

    console.log('send response');
    res.status(200).send({
      "total_user": total_user,
      "add_user": updateObj.add_user,
      "add_user_validation_error": updateObj.add_user_validation_error,
      "update_user": updateObj.update_user,
      "update_user_validation_error": updateObj.update_user_validation_error
    });
  }),

};



//pass all user for update user
const goUpdate = async (allusers) => {
  console.log('go udpate fun call');
  let updateObj = {
    add_user: 0,
    update_user: 0,
    add_user_validation_error: 0,
    update_user_validation_error: 0
  }

  for (const item of allusers) {
    let obj = {
      'username': item.name,
      'number': item.phone_number,
      'email': item.email,
      'entity': item.entity,
      'gender': item.gender,
      'date_of_birth': item.date_of_birth,
      'address': item.address,
      'band': item.band,
      'department': item.department,
      'desination': item.desination,
      'updatedAt': moment().format('MMMM Do YYYY, h:mm:ss a')
    }

    let res = await updateuser(obj, item.empId);
    console.log('call updateuser fun...', res);
    if (res == 'add') {
      updateObj.add_user = updateObj.add_user + 1;
    } else if (res == 'update') {
      updateObj.update_user = updateObj.update_user + 1;
    } else if (res == 'add-validation-error') {
      updateObj.add_user_validation_error = updateObj.add_user_validation_error + 1;
    } else if (res == 'update-validation-error') {
      updateObj.update_user_validation_error = updateObj.update_user_validation_error + 1;
    }
  }

  console.log('update all users sucess');
  return updateObj;
}
const getdata = async (filterData, search, key) => {

  let allusers = [];

  let options = {
    method: 'POST',
    uri: Constants.carelineUserApiUrl,
    headers: Constants.carelineUserHeaders,
    body: JSON.stringify(filterData)
  }
  await new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let res = JSON.parse(body);
        if (res.status == true) {
          console.log('res', res.data.length);
          if (key == 'empId') {
            const employeeIdNumber = Number(search);
            allusers = res.data.filter(item => item.employee_id === employeeIdNumber);
          }
          else if (key === "name") {
            allusers = res.data.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
          }
          console.log(allusers)
        }
        //console.log('allusers',allusers);
        console.log('get data....');
        resolve(body);
      } else {
        console.log('error===============================', error);
        // reject.catch(=>null)
        reject(error);
      }
    });
  });
  // Promise.catch(()=>null)
  return allusers;
}

//get user list from api
// const getdata = async (filterData) => {
//   let allusers = [];
//   await new Promise(function (resolve, reject) {
//     request({
//         method: 'POST',
//         uri: Constants.carelineUserApiUrl,
//         headers: Constants.carelineUserHeaders,
//         body: JSON.stringify(filterData)
//     }, function (error, response, body) {
//         if (!error && response.statusCode == 200) {
//           let res = JSON.parse(body);
//           if (res.status == true) {
//             console.log('res', res.data.length);
//             allusers = res.data.filter(item => (item.department == 'Admin' || item.department == 'Tech'));
//           }
//           //console.log('allusers',allusers);
//           console.log('get data....');
//           resolve(body);
//         } else {
//           console.log('error===============================', error);
//           reject(error);
//         }
//     });
//   });
//   return allusers;
// }
const assignRoleId = async (rolename, userobj) => {
  let roleAccess = await Roles.findOne({ roleName: 'default_role_allusers', is_deleted: false })
  userobj.roleId = roleAccess._id
  console.log(userobj)
  return userobj;
}


//add and update user in database
const updateuser = async (obj, empId) => {

  const filter = { empId: empId };
  const checkuser = await User.find(filter);
  if (checkuser.length > 0) {
    const upFilter = { _id: mongoose.Types.ObjectId(checkuser[0].id) };

    return await User.findByIdAndUpdate(upFilter, obj, { new: true })
      .then((res) => {

        return 'update';
      }).catch((err) => {
        console.log('err', err);
        if (err.name === 'ValidationError') {
          return 'update-validation-error';
        }
      });
  } else {
    console.log('not exists user: ', filter);
    obj.password = '123456';
    obj.password = bcrypt.hashSync(obj.password, 8);

    obj.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    obj.empId = empId;
    const user = new User(obj);
    return await user.save().then((res) => {

      return 'add';
    }).catch((err) => {
      console.log('err', err);
      if (err.name === 'ValidationError') {
        return 'add-validation-error';
      }
    });
  }
}